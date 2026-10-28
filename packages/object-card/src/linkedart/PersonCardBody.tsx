import {
  findByPath,
  findTimespan,
  formatRecordedDate,
  getRecordedDates,
  type RecordedDates,
  getContent,
  getStatusValues,
  getValues,
  isLinkedArtNode,
  LinkedArtNode,
  type StatusValue,
} from '@globalise/common';
import {
  ObjectCardBody,
  ObjectCardDisclosure,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { type ReactNode } from 'react';
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { getNotes, isVisibleSource, SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';
import { personStatusGroups, getStatusProperties, type StatusProperty, type StatusGroup } from './LabeledKey.ts';
import { PersonReferencePanel } from './PersonReferencePanel.tsx';
import {
  getResidenceLabel,
  groupPersonStatuses,
  groupRecords,
  getPersonNameRecords,
  sortPersonNames,
  uniqueStatusValues,
} from './PersonStatusModel.ts';

type PersonCardBodyProps = {
  entity: LinkedArtNode;
};

export function PersonCardBody({ entity }: PersonCardBodyProps) {
  const notes = getNotes(entity);
  const occupationGroup = personStatusGroups.find(
    (group) => group.type === 'SocialStatus',
  );
  const locationGroup = personStatusGroups.find(
    (group) => group.type === 'ResidentialStatus',
  );
  const additionalSources = locationGroup
    ? getStatusNodes(entity, locationGroup)
      .filter((status) => !hasStatusValues(status, locationGroup))
      .flatMap(getVisibleSources)
    : [];
  const sources = [...new Map(
    [...getVisibleSources(entity), ...additionalSources].map((source) => [JSON.stringify(source), source]),
  ).values()];
  const relationshipTypes = ['FamilyStatus', 'SocialRelationStatus', 'MembershipStatus'];
  const relationshipGroups = personStatusGroups.filter((group) =>
    relationshipTypes.includes(group.type) && hasGroupInformation(entity, group),
  );
  const unassignedDates = [...new Set(getValues(entity['aaao:ZP17i_is_social_status_subject_of']).map(formatRecordedDate))];
  const profileGroups = personStatusGroups.filter(
    (group) => group !== occupationGroup && group !== locationGroup && !relationshipTypes.includes(group.type),
  );
  const hasPersonalDetails = getPersonNameRecords(entity).length > 0
    || getPersonEvents(entity, 'born').length > 0
    || getPersonEvents(entity, 'died').length > 0
    || profileGroups.some((group) => hasGroupInformation(entity, group))
    || unassignedDates.length > 0
    || notes.length > 0
    || sources.length > 0;

  return (
    <ObjectCardBody>
      <ObjectCardPanel side="left">
        {occupationGroup && (
          <PersonStatusGroup entity={entity} group={occupationGroup} />
        )}
        {locationGroup && (
          <PersonStatusGroup
            entity={entity}
            group={locationGroup}
          />
        )}
        {hasPersonalDetails && <ObjectCardSection title="Personal details" collapsible>
          <div className="person-status-list">
            <PersonNameDetailsSection entity={entity} />
            <PersonEventSection
              entity={entity}
              property="born"
              title="Born"
            />
            <PersonEventSection
              entity={entity}
              property="died"
              title="Died"
            />
            {profileGroups.map((group) => (
              <PersonStatusGroup
                key={group.label}
                entity={entity}
                group={group}
                section={false}
              />
            ))}
            {!!unassignedDates.length && (
              <ObjectCardDisclosure
                summary={<PersonSummaryProperty label="Recorded status dates" value={unassignedDates.join(', ')} />}
              >
                <p className="person-status-note">These dates are not linked to a specific occupation or status in this record.</p>
              </ObjectCardDisclosure>
            )}
            {!!notes.length && (
              <ObjectCardDisclosure
                summary={<span className="person-status-summary-label">Notes</span>}
              >
                <span className="person-status-summary-value">
                  <StatusValues linked={false} stacked values={notes} />
                </span>
              </ObjectCardDisclosure>
            )}
            {!!sources.length && (
              <ObjectCardDisclosure
                summary={<span className="person-status-summary-label">Sources</span>}
              >
                <SourceList
                  includeInternalLabels
                  showNotes
                  sources={sources}
                />
              </ObjectCardDisclosure>
            )}
          </div>
        </ObjectCardSection>}
        {!!relationshipGroups.length && (
          <ObjectCardSection title="Relationships" collapsible>
            <div className="person-status-list">
              {relationshipGroups.map((group) => (
                <PersonStatusGroup key={group.label} entity={entity} group={group} section={false} />
              ))}
            </div>
          </ObjectCardSection>
        )}
      </ObjectCardPanel>
      <PersonReferencePanel entity={entity} />
    </ObjectCardBody>
  );
}

export function getPersonTitle(entity: LinkedArtNode): string {
  const [name] = sortPersonNames(getPersonNameRecords(entity))
    .map((record) => record.name);
  return (
    [name, getContent(entity), ...findByPath(entity, ['identified_by'])
      .filter((identifier) => identifier.type === 'Name').map(getContent)].find(
      (value) => !!value,
    ) ?? 'Name not recorded'
  );
}

export function PersonOverview({ entity }: PersonCardBodyProps) {
  const names = [
    ...new Set(sortPersonNames(getPersonNameRecords(entity)).map((record) => record.name)),
  ];
  const alternativeNames = names.slice(1);
  const classifications = uniqueStatusValues(getStatusNodes(entity, personStatusGroups[0])
    .flatMap((status) => getStatusValues(status, ['ascribes_classification'])));
  const occupations = uniqueStatusValues(getStatusNodes(entity, personStatusGroups[1])
    .flatMap((status) => getStatusValues(status, ['ascribes_social_status'])));
  const born = findByPath(entity, ['born']);
  const died = findByPath(entity, ['died']);

  if (
    !alternativeNames.length &&
    !classifications.length &&
    !occupations.length &&
    !born.length &&
    !died.length
  ) {
    return null;
  }
  return (
    <div className="person-overview">
      <PersonOverviewFact label="also" values={alternativeNames} />
      <PersonOverviewFact label="classification" values={classifications} />
      <PersonOverviewEvents label="born" events={born} />
      <PersonOverviewEvents label="died" events={died} />
      <PersonOverviewFact values={occupations} />
    </div>
  );
}

type PersonOverviewFactProps = {
  label?: string;
  values: StatusValue[];
};

function PersonOverviewFact({ label: factLabel, values }: PersonOverviewFactProps) {
  if (!values.length) {
    return null;
  }
  return (
    <span className="person-overview-fact">
      {factLabel && <span className="person-overview-label">{factLabel}:</span>}
      <span className="person-overview-value">
        {values.map((value, index) => (
          <span key={index}>
            {index > 0 && ', '}
            {isLinkedArtNode(value) ? <RelationValue node={value} /> : value}
          </span>
        ))}
      </span>
    </span>
  );
}

function PersonOverviewEvents({ label: factLabel, events }: {
  label: string;
  events: LinkedArtNode[];
}) {
  const values = events.map((event) => ({
    timespan: findTimespan(event),
    dates: getRecordedDates(event),
    places: uniqueStatusValues(getStatusValues(event, ['took_place_at'])),
  })).filter(({ timespan, dates, places }) => !!timespan || !!dates || places.length > 0);
  if (!values.length) {
    return null;
  }
  return (
    <span className="person-overview-fact">
      <span className="person-overview-label">{factLabel}:</span>
      <span className="person-overview-value">
        {values.map(({ timespan, dates, places }, index) => (
          <span key={index}>
            {index > 0 && '; '}
            {timespan
              ? <TimespanValue timespan={timespan} mode="event" />
              : dates && <RecordedDatesValue dates={dates} />}
            {!!places.length && (
              <>
                {(!!timespan || !!dates) && ', '}
                {places.map((place, placeIndex) => (
                  <span key={placeIndex}>
                    {placeIndex > 0 && ', '}
                    {isLinkedArtNode(place) ? <RelationValue node={place} /> : place}
                  </span>
                ))}
              </>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

function PersonNameDetailsSection({ entity }: PersonCardBodyProps) {
  const groups = groupRecords(getPersonNameRecords(entity), (record) => record.name);
  return <>{groups.map(({ key, records }) => {
    const details = records.some(({ status }) => hasNameDetails(status)) ? records : [];
    return (
      <ObjectCardDisclosure
        key={key}
        summary={(
          <>
            <PersonSummaryProperty
              label="Name"
              value={<span className="person-name-value">{records[0].name}</span>}
            />
            <StatusRecordCount count={records.length} />
          </>
        )}
      >
        {details.length > 0 ? details.map(({ key: recordKey, status }, index) => (
          <div key={recordKey} className="person-status-record">
            {records.length > 1 && <StatusRecordLabel index={index} />}
            <ObjectCardPropertyList className="person-status-details">
              <StatusValuesProperty label="Classification" values={getStatusValues(status, ['classified_as'])} />
              <StatusDateProperty node={status} showMissing={records.length > 1} />
              <NotesProperty node={status} />
              <SourcesProperty node={status} />
            </ObjectCardPropertyList>
          </div>
        )) : null}
      </ObjectCardDisclosure>
    );
  })}</>;
}

function hasNameDetails(status: LinkedArtNode): boolean {
  return hasStatusEvidence(status)
    || !!findTimespan(status)
    || !!getRecordedDates(status);
}

function StatusRecordCount({ count }: { count: number }) {
  return count > 1 ? <span className="person-status-count">{count} records</span> : null;
}

function StatusRecordLabel({ index }: { index: number }) {
  return <div className="person-status-label">Record {index + 1}</div>;
}

function StatusDateProperty({ node, showMissing = false }: { node: LinkedArtNode; showMissing?: boolean }) {
  const timespan = findTimespan(node);
  const dates = timespan ? null : getRecordedDates(node);
  return !!timespan || !!dates || showMissing ? (
    <ObjectCardProperty
      label={timespan ? 'Date bounds' : 'Date'}
      value={timespan ? <TimespanValue timespan={timespan} mode="boundaries" /> : dates ? <RecordedDatesValue dates={dates} /> : 'Not recorded'}
    />
  ) : null;
}

type PersonEventSectionProps = {
  entity: LinkedArtNode;
  property: 'born' | 'died';
  title: string;
};

function PersonEventSection({
  entity,
  property,
  title,
}: PersonEventSectionProps) {
  const events = getPersonEvents(entity, property);
  if (!events.length) {
    return null;
  }

  const content = events.map(({
    event,
    locations,
    classifications,
    dates,
    notes,
    sources,
    timespan,
  }, index) => (
    <ObjectCardDisclosure
      key={index}
      summary={(
        <div className="person-status-summary-content">
          <PersonSummaryProperty
            label={title}
            value={timespan ? <TimespanValue timespan={timespan} mode="event" /> : dates && <RecordedDatesValue dates={dates} />}
          />
          {!!locations.length && (
            <PersonSummaryProperty
              label={property === 'born' ? 'Birthplace' : 'Place of death'}
              value={<StatusValues values={locations} />}
            />
          )}
          {!timespan && !dates && !locations.length && (
            <span className="person-status-summary-label">{title}</span>
          )}
        </div>
      )}
    >
      {(classifications.length || notes.length || sources.length) ? (
        <ObjectCardPropertyList className="person-status-details">
          <StatusValuesProperty label="Recorded classifications" values={classifications} />
          <NotesProperty node={event} />
          <SourcesProperty node={event} />
        </ObjectCardPropertyList>
      ) : null}
    </ObjectCardDisclosure>
  ));
  return <>{content}</>;
}

function getPersonEvents(entity: LinkedArtNode, property: 'born' | 'died') {
  return findByPath(entity, [property])
    .map((event) => ({
      event,
      locations: getStatusValues(event, ['took_place_at']),
      classifications: getStatusValues(event, ['classified_as']),
      dates: getRecordedDates(event),
      notes: getNotes(event),
      sources: getVisibleSources(event),
      timespan: findTimespan(event),
    }))
    .filter(({ locations, classifications, dates, notes, sources, timespan }) =>
      locations.length > 0 || classifications.length > 0 || !!dates || notes.length > 0 || sources.length > 0 || !!timespan,
    );
}

type PersonStatusGroupProps = {
  entity: LinkedArtNode;
  group: StatusGroup;
  section?: boolean;
};

function PersonStatusGroup({
  entity,
  group,
  section = true,
}: PersonStatusGroupProps) {
  const statuses = getStatusNodes(entity, group)
    .filter((status) => hasStatusValues(status, group));
  const additionalNodes = getAdditionalStatusNodes(entity, group);
  const isOccupationGroup = group.type === 'SocialStatus';
  if (!statuses.length && !additionalNodes.length) {
    return null;
  }

  const content = groupPersonStatuses(statuses).map(({ key, records }, index) => {
    const status = records[0];
    const dateKey = (node: LinkedArtNode) => JSON.stringify([
      findTimespan(node), getRecordedDates(node),
    ]);
    const statusDates = dateKey(status);
    const sharedDates = records.every((record) => dateKey(record) === statusDates);
    const timespan = sharedDates ? findTimespan(status) : null;
    const recordedDates = sharedDates && !timespan ? getRecordedDates(status) : null;
    const summaryProperties = getStatusProperties(status);
    const details = records.some((record) => hasStatusDetails(record, group)) ? records : [];

    return (
      <ObjectCardDisclosure
        key={key}
        className={isOccupationGroup ? 'person-occupation-status' : undefined}
        defaultExpanded={section && index === 0}
        summary={(
          <>
            <PersonStatusSummary
              group={group}
              properties={summaryProperties}
              recordedDates={recordedDates}
              timespan={timespan}
            />
            {!sharedDates && records.map((record, recordIndex) => {
              const recordTimespan = findTimespan(record);
              const recordDates = recordTimespan ? null : getRecordedDates(record);
              return (
                <div key={recordIndex} className="person-status-summary-date">
                  <StatusRecordLabel index={recordIndex} />
                  {recordTimespan
                    ? <TimespanValue timespan={recordTimespan} mode="summary" />
                    : recordDates
                      ? <RecordedDatesValue dates={recordDates} />
                      : 'Date: not recorded'}
                </div>
              );
            })}
            <StatusRecordCount count={records.length} />
          </>
        )}
      >
        {details.length > 0 ? details.map((record, recordIndex) => (
          <div key={recordIndex} className="person-status-record">
            {records.length > 1 && <StatusRecordLabel index={recordIndex} />}
            <ObjectCardPropertyList className="person-status-details">
              <StatusValuesProperty label="Geographic scope" values={getStatusValues(record, ['has_geographic_scope'])} />
              <StatusValuesProperty label="Classification" values={getStatusValues(record, ['classified_as'])} />
              <NotesProperty node={record} />
              <SourcesProperty className={isOccupationGroup ? 'person-status-sources' : undefined} node={record} />
            </ObjectCardPropertyList>
          </div>
        )) : null}
      </ObjectCardDisclosure>
    );
  });
  return section ? (
    <ObjectCardSection title={group.label} collapsible>
      <div className="person-status-list">
        {content}
        <UnassignedStatusInformation nodes={additionalNodes} />
      </div>
    </ObjectCardSection>
  ) : <>{content}<UnassignedStatusInformation nodes={additionalNodes} /></>;
}

function UnassignedStatusInformation({ nodes }: { nodes: LinkedArtNode[] }) {
  const sources = nodes.filter((node) => node.type === 'LinguisticObject' && isVisibleSource(node, true, true));
  const places = nodes.filter((node) => node.type === 'Place');
  const terms = nodes.filter((node) => node.type === 'Type');
  const other = nodes.filter((node) => !['LinguisticObject', 'Place', 'Type'].includes(node.type));
  if (!sources.length && !places.length && !terms.length && !other.length) {
    return null;
  }
  return (
    <ObjectCardDisclosure summary={<span className="person-status-summary-label">Other recorded information</span>}>
      <p className="person-status-note">This information is recorded separately from individual status records.</p>
      <ObjectCardPropertyList className="person-status-details">
        <StatusValuesProperty label="Places mentioned" values={places} />
        <StatusValuesProperty label="Recorded terms" values={terms} />
        <StatusValuesProperty label="Other values" values={other} />
        {!!sources.length && (
          <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes />} />
        )}
      </ObjectCardPropertyList>
    </ObjectCardDisclosure>
  );
}

type PersonStatusSummaryProps = {
  group: StatusGroup;
  properties: (StatusProperty & { values: StatusValue[] })[];
  recordedDates: RecordedDates | null;
  timespan: ReturnType<typeof findTimespan>;
};

function PersonStatusSummary({
  group,
  properties,
  recordedDates,
  timespan,
}: PersonStatusSummaryProps) {
  const isOccupation = group.type === 'SocialStatus';
  const connection = group.type === 'ResidentialStatus'
    ? properties.find((property) => property.keys.includes('ascribes_residence_relation'))
    : undefined;
  const place = properties.find((property) => property.keys.includes('ascribes_residence_place'));
  const renderProperties = (displayedProperties: typeof properties) => displayedProperties.length
    ? displayedProperties.map((property, index) => (
      <PersonSummaryProperty
        key={property.label}
        label={isOccupation && index === 0 ? undefined : property.label}
        value={<StatusValues values={property.values} linked={property.linked} stacked={property.stacked} />}
      />
    ))
    : isOccupation && (timespan || recordedDates)
      ? null
      : <span className="person-status-summary-label">{isOccupation ? 'Status details' : group.label}</span>;
  const renderConnection = (text: string) => {
    const residenceLabel = getResidenceLabel([text]);
    return residenceLabel && place
      ? renderProperties([{ ...place, label: residenceLabel }])
      : renderProperties(properties);
  };
  return (
    <div className="person-status-summary-content">
      {timespan && (
        <span className="person-status-summary-date">
          <TimespanValue timespan={timespan} mode="summary" />
        </span>
      )}
      {recordedDates && <RecordedDatesValue dates={recordedDates} />}
      {connection?.values.length === 1 && place
        ? isLinkedArtNode(connection.values[0])
          ? <RelationValue node={connection.values[0]} render={renderConnection} />
          : renderConnection(connection.values[0])
        : renderProperties(properties)}
    </div>
  );
}

type PersonSummaryPropertyProps = {
  label?: string;
  value?: ReactNode;
};

function PersonSummaryProperty({ label: propertyLabel, value }: PersonSummaryPropertyProps) {
  if (!value) {
    return null;
  }
  return (
    <span className="person-status-summary-property">
      {propertyLabel && (
        <span className="person-status-summary-label">{propertyLabel}: </span>
      )}
      <span className="person-status-summary-value">{value}</span>
    </span>
  );
}

function hasStatusEvidence(status: LinkedArtNode, includeSources = true): boolean {
  return getStatusValues(status, ['classified_as']).length > 0
    || includeSources && getVisibleSources(status).length > 0
    || getNotes(status).length > 0;
}

function hasStatusDetails(status: LinkedArtNode, _group: StatusGroup, includeSources = true): boolean {
  return getStatusValues(status, ['has_geographic_scope']).length > 0
    || hasStatusEvidence(status, includeSources);
}

function getAdditionalStatusNodes(entity: LinkedArtNode, group: StatusGroup) {
  return findByPath(entity, [group.key]).filter((node) => node.type !== group.type
    && (node.type !== 'LinguisticObject' || isVisibleSource(node, true, true)));
}

function hasGroupInformation(entity: LinkedArtNode, group: StatusGroup) {
  return getStatusNodes(entity, group).some((status) => hasStatusValues(status, group))
    || getAdditionalStatusNodes(entity, group).length > 0;
}

function hasStatusValues(status: LinkedArtNode, group: StatusGroup): boolean {
  return getStatusProperties(status).length > 0 || hasStatusDetails(status, group, group.type !== 'ResidentialStatus')
    || !!findTimespan(status)
    || !!getRecordedDates(status);
}

function getStatusNodes(
  entity: LinkedArtNode,
  definition: Pick<StatusGroup, 'key' | 'type'>,
): LinkedArtNode[] {
  return findByPath(entity, [definition.key]).filter(
    (status) => status.type === definition.type,
  );
}

type StatusValuesPropertyProps = {
  className?: string;
  label: string;
  linked?: boolean;
  stacked?: boolean;
  values: StatusValue[];
};

function StatusValuesProperty({
  className,
  label: propertyLabel,
  linked,
  stacked,
  values,
}: StatusValuesPropertyProps) {
  if (!values.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      className={className}
      label={propertyLabel}
      value={<StatusValues values={values} linked={linked} stacked={stacked} />}
    />
  );
}

function StatusValues({
  values,
  linked = true,
  stacked,
}: Pick<StatusValuesPropertyProps, 'values' | 'linked' | 'stacked'>) {
  return (
    <span className={`person-status-values${stacked ? ' stacked' : ''}`}>
      {values.map((value, index) => (
        <span key={index}>
          {!stacked && index > 0 && ', '}
          {isLinkedArtNode(value)
            ? linked
              ? <RelationLink node={value} />
              : <RelationValue node={value} />
            : value}
        </span>
      ))}
    </span>
  );
}

function SourcesProperty({
  className,
  node,
}: {
  className?: string;
  node: LinkedArtNode;
}) {
  const sources = getVisibleSources(node);
  if (!sources.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      className={className}
      label="Sources"
      value={(
        <SourceList
          includeInternalLabels
          showNotes
          sources={sources}
        />
      )}
    />
  );
}

function getVisibleSources(node: LinkedArtNode): LinkedArtNode[] {
  return findByPath(node, ['referred_to_by'])
    .filter((source) => isVisibleSource(source, true, true));
}

function NotesProperty({ node }: { node: LinkedArtNode }) {
  const notes = getNotes(node);
  if (!notes.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      label="Notes"
      value={<StatusValues linked={false} stacked values={notes} />}
    />
  );
}

function RecordedDatesValue({ dates }: { dates: RecordedDates }) {
  return (
    <span className="person-status-summary-date timespan-boundaries">
      {!!dates.starts.length && (
        <span>Recorded starts: {dates.starts.join(', ')}</span>
      )}
      {!!dates.ends.length && (
        <span>Recorded ends: {dates.ends.join(', ')}</span>
      )}
      {!!dates.dates.length && <span>Recorded dates: {dates.dates.join(', ')}</span>}
    </span>
  );
}
