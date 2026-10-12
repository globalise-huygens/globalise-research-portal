import {
  findByPath,
  getContent,
  getValue,
  getValues,
  isLinkedArtNode,
  label,
  LinkedArtNode,
} from '@globalise/common';
import {
  ObjectCardBody,
  ObjectCardDisclosureButton,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { type ReactNode, useId, useState } from 'react';
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { getNotes, isVisibleSource, SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';
import { PersonReferencePanel } from './PersonReferencePanel.tsx';
import {
  formatRecordedDate,
  getPersonTimespan,
  getRecordedDates,
  getResidenceLabel,
  getStatusValues,
  groupPersonClaims,
  groupRecords,
  isPreferredPersonName,
  uniqueClaimValues,
  type RecordedDates,
} from './PersonClaimModel.ts';

type PersonCardBodyProps = {
  entity: LinkedArtNode;
};

type StatusProperty = {
  label: string;
  keys: string[];
  linked?: boolean;
  stacked?: boolean;
};

type StatusDefinition = {
  key: string;
  type: string;
  properties: StatusProperty[];
};

type StatusGroup = StatusDefinition & {
  title: string;
};

type StatusValue = LinkedArtNode | string;

const personNameDefinition: StatusDefinition = {
  key: 'is_appellative_subject_of',
  type: 'AppellativeStatus',
  properties: [],
};

const personStatusGroups: StatusGroup[] = [
  {
    title: 'Classifications',
    key: 'is_classificatory_subject_of',
    type: 'ClassificatoryStatus',
    properties: [
      { label: 'Classification', keys: ['ascribes_classification'] },
    ],
  },
  {
    title: 'Occupations and statuses',
    key: 'is_social_status_subject_of',
    type: 'SocialStatus',
    properties: [
      { label: 'Status or occupation', keys: ['ascribes_social_status'] },
      {
        label: 'In relation to',
        keys: ['ascribes_social_status_in_relation_to'],
      },
    ],
  },
  {
    title: 'Places',
    key: 'is_residence_subject_of',
    type: 'ResidentialStatus',
    properties: [
      {
        label: 'Connection',
        keys: ['ascribes_residence_relation'],
      },
      { label: 'Place', keys: ['ascribes_residence_place'] },
    ],
  },
  {
    title: 'Family relationships',
    key: 'is_familial_subject_of',
    type: 'FamilyStatus',
    properties: [
      {
        label: 'Relationship',
        keys: ['ascribes_familial_relation'],
        linked: false,
      },
      { label: 'Person', keys: ['ascribes_relative'], stacked: true },
    ],
  },
  {
    title: 'Social relations',
    key: 'is_social_relation_subject_of',
    type: 'SocialRelationStatus',
    properties: [
      { label: 'Relationship', keys: ['ascribes_social_relation'] },
      { label: 'Group', keys: ['ascribes_social_relation_target'] },
    ],
  },
  {
    title: 'Similarity',
    key: 'is_similarity_subject_of',
    type: 'SimilarityStatus',
    properties: [
      { label: 'Entity', keys: ['ascribes_similarity_target'] },
      { label: 'Mode', keys: ['ascribes_similarity_mode'] },
    ],
  },
  {
    title: 'Memberships',
    key: 'is_membership_subject_of',
    type: 'MembershipStatus',
    properties: [
      { label: 'Membership type', keys: ['ascribes_membership_relation'] },
      { label: 'Group', keys: ['ascribes_group'] },
    ],
  },
  {
    title: 'Succession',
    key: 'is_successor_status_subject_of',
    type: 'SuccessorStatus',
    properties: [
      {
        label: 'Succession type',
        keys: ['ascribes_succession_relation'],
      },
      {
        label: 'Sovereignty',
        keys: ['ascribes_succeeded_sovereignty'],
      },
    ],
  },
  {
    title: 'Ownership',
    key: 'is_ownership_subject_of',
    type: 'OwnershipStatus',
    properties: [],
  },
  {
    title: 'Custody',
    key: 'is_custodial_subject_of',
    type: 'CustodialStatus',
    properties: [],
  },
];

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
    relationshipTypes.includes(group.type) && getStatusNodes(entity, group).some((status) => hasStatusValues(status, group)),
  );
  const unassignedDates = [...new Set(getValues(entity['aaao:ZP17i_is_social_status_subject_of']).map(formatRecordedDate))];
  const profileGroups = personStatusGroups.filter(
    (group) => group !== occupationGroup && group !== locationGroup && !relationshipTypes.includes(group.type),
  );

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
        <ObjectCardSection title="Personal details" collapsible>
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
                key={group.title}
                entity={entity}
                group={group}
                section={false}
              />
            ))}
            {!!relationshipGroups.length && (
              <>
                <h4 className="person-detail-heading">Relationships</h4>
                {relationshipGroups.map((group) => (
                  <PersonStatusGroup key={group.title} entity={entity} group={group} section={false} />
                ))}
              </>
            )}
            {!!unassignedDates.length && (
              <PersonDisclosure
                summary={<PersonSummaryProperty label="Recorded status dates" value={unassignedDates.join(', ')} />}
              >
                <p className="person-claim-note">These dates are not linked to a specific occupation or status in this record.</p>
              </PersonDisclosure>
            )}
            {!!notes.length && (
              <PersonDisclosure
                summary={<span className="person-status-summary-label">Notes</span>}
              >
                <span className="person-status-summary-value">
                  <StatusValues linked={false} stacked values={notes} />
                </span>
              </PersonDisclosure>
            )}
            {!!sources.length && (
              <PersonDisclosure
                summary={<span className="person-status-summary-label">Sources</span>}
              >
                <SourceList
                  includeInternalLabels
                  showNotes
                  sources={sources}
                />
              </PersonDisclosure>
            )}
          </div>
        </ObjectCardSection>
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
  const classifications = uniqueClaimValues(getStatusNodes(entity, personStatusGroups[0])
    .flatMap((status) => getStatusValues(status, ['ascribes_classification'])));
  const occupations = uniqueClaimValues(getStatusNodes(entity, personStatusGroups[1])
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
    timespan: getPersonTimespan(event),
    dates: getRecordedDates(event),
    places: uniqueClaimValues(getStatusValues(event, ['took_place_at'])),
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
              ? <TimespanValue timespan={timespan} event />
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
      <PersonDisclosure
        key={key}
        summary={(
          <>
            <PersonSummaryProperty
              label="Name"
              value={<span className="person-name-value">{records[0].name}</span>}
            />
            <ClaimRecordCount count={records.length} />
          </>
        )}
      >
        {details.length > 0 ? details.map(({ key: recordKey, status }, index) => (
          <div key={recordKey} className="person-claim-record">
            {records.length > 1 && <ClaimRecordLabel index={index} />}
            <ObjectCardPropertyList className="person-status-details">
              <StatusValuesProperty label="Classification" values={getStatusValues(status, ['classified_as'])} />
              <ClaimDateProperty node={status} showMissing={records.length > 1} />
              <NotesProperty node={status} />
              <SourcesProperty node={status} />
            </ObjectCardPropertyList>
          </div>
        )) : null}
      </PersonDisclosure>
    );
  })}</>;
}

function hasNameDetails(status: LinkedArtNode): boolean {
  return getStatusValues(status, ['classified_as']).length > 0
    || !!getPersonTimespan(status)
    || !!getRecordedDates(status)
    || getVisibleSources(status).length > 0
    || getNotes(status).length > 0;
}

function ClaimRecordCount({ count }: { count: number }) {
  return count > 1 ? <span className="person-claim-count">{count} records</span> : null;
}

function ClaimRecordLabel({ index }: { index: number }) {
  return <div className="person-claim-label">Record {index + 1}</div>;
}

function ClaimDateProperty({ node, showMissing = false }: { node: LinkedArtNode; showMissing?: boolean }) {
  const timespan = getPersonTimespan(node);
  const dates = timespan ? null : getRecordedDates(node);
  return !!timespan || !!dates || showMissing ? (
    <ObjectCardProperty
      label={timespan ? 'Date bounds' : 'Date'}
      value={timespan ? <TimespanValue timespan={timespan} boundaries /> : dates ? <RecordedDatesValue dates={dates} /> : 'Not recorded'}
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
  const events = findByPath(entity, [property])
    .map((event) => ({
      event,
      locations: getStatusValues(event, ['took_place_at']),
      classifications: getStatusValues(event, ['classified_as']),
      dates: getRecordedDates(event),
      notes: getNotes(event),
      sources: getVisibleSources(event),
      timespan: getPersonTimespan(event),
    }))
    .filter(({ locations, classifications, dates, notes, sources, timespan }) =>
      locations.length > 0 || classifications.length > 0 || !!dates || notes.length > 0 || sources.length > 0 || !!timespan,
    );
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
    <PersonDisclosure
      key={index}
      summary={(
        <div className="person-status-summary-content">
          <PersonSummaryProperty
            label={title}
            value={timespan ? <TimespanValue timespan={timespan} event /> : dates && <RecordedDatesValue dates={dates} />}
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
    </PersonDisclosure>
  ));
  return <>{content}</>;
}

type PersonStatusGroupProps = {
  entity: LinkedArtNode;
  group: StatusGroup;
  section?: boolean;
  title?: string;
};

function PersonStatusGroup({
  entity,
  group,
  section = true,
  title = group.title,
}: PersonStatusGroupProps) {
  const statuses = getStatusNodes(entity, group)
    .filter((status) => hasStatusValues(status, group));
  const additionalNodes = findByPath(entity, [group.key])
    .filter((node) => node.type !== group.type);
  const isOccupationGroup = group.type === 'SocialStatus';
  if (!statuses.length && !additionalNodes.length) {
    return null;
  }

  const content = groupPersonClaims(statuses).map(({ key, records }, index) => {
    const status = records[0];
    const dateKey = (node: LinkedArtNode) => JSON.stringify([
      getPersonTimespan(node), getRecordedDates(node),
    ]);
    const sharedDates = records.every((record) => dateKey(record) === dateKey(status));
    const timespan = sharedDates ? getPersonTimespan(status) : null;
    const recordedDates = sharedDates && !timespan ? getRecordedDates(status) : null;
    const summaryProperties = group.properties
      .map((property) => ({ ...property, values: getStatusValues(status, property.keys) }))
      .filter((property) => property.values.length);
    const details = records.some((record) => hasStatusDetails(record, group)) ? records : [];

    return (
      <PersonDisclosure
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
              const recordTimespan = getPersonTimespan(record);
              const recordDates = recordTimespan ? null : getRecordedDates(record);
              return (
                <div key={recordIndex} className="person-status-summary-date">
                  <ClaimRecordLabel index={recordIndex} />
                  {recordTimespan
                    ? <TimespanValue timespan={recordTimespan} boundaries />
                    : recordDates
                      ? <RecordedDatesValue dates={recordDates} />
                      : 'Date: not recorded'}
                </div>
              );
            })}
            <ClaimRecordCount count={records.length} />
          </>
        )}
      >
        {details.length > 0 ? details.map((record, recordIndex) => (
          <div key={recordIndex} className="person-claim-record">
            {records.length > 1 && <ClaimRecordLabel index={recordIndex} />}
            <ObjectCardPropertyList className="person-status-details">
              {getAdditionalStatusProperties(record, group).map((property) => (
                <StatusValuesProperty key={property.key} label={property.label} values={property.values} />
              ))}
              <StatusValuesProperty label="Geographic scope" values={getStatusValues(record, ['has_geographic_scope'])} />
              <StatusValuesProperty label="Classification" values={getStatusValues(record, ['classified_as'])} />
              <NotesProperty node={record} />
              <SourcesProperty className={isOccupationGroup ? 'person-status-sources' : undefined} node={record} />
            </ObjectCardPropertyList>
          </div>
        )) : null}
      </PersonDisclosure>
    );
  });
  return section ? (
    <ObjectCardSection title={title} collapsible>
      <div className="person-status-list">
        {content}
        <UnassignedStatusInformation nodes={additionalNodes} />
      </div>
    </ObjectCardSection>
  ) : <>{content}<UnassignedStatusInformation nodes={additionalNodes} /></>;
}

function UnassignedStatusInformation({ nodes }: { nodes: LinkedArtNode[] }) {
  const sources = nodes.filter((node) => node.type === 'LinguisticObject' && isVisibleSource(node, true));
  const places = nodes.filter((node) => node.type === 'Place');
  const terms = nodes.filter((node) => node.type === 'Type');
  const other = nodes.filter((node) => !['LinguisticObject', 'Place', 'Type'].includes(node.type));
  if (!sources.length && !places.length && !terms.length && !other.length) {
    return null;
  }
  return (
    <PersonDisclosure summary={<span className="person-status-summary-label">Other recorded information</span>}>
      <p className="person-claim-note">This information is recorded separately from individual claims.</p>
      <ObjectCardPropertyList className="person-status-details">
        <StatusValuesProperty label="Places mentioned" values={places} />
        <StatusValuesProperty label="Recorded terms" values={terms} />
        <StatusValuesProperty label="Other values" values={other} />
        {!!sources.length && (
          <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes />} />
        )}
      </ObjectCardPropertyList>
    </PersonDisclosure>
  );
}

type PersonStatusSummaryProps = {
  group: StatusGroup;
  properties: (StatusProperty & { values: StatusValue[] })[];
  recordedDates: RecordedDates | null;
  timespan: ReturnType<typeof getPersonTimespan>;
};

function PersonStatusSummary({
  group,
  properties,
  recordedDates,
  timespan,
}: PersonStatusSummaryProps) {
  const isOccupation = group.type === 'SocialStatus';
  const residenceLabel = group.type === 'ResidentialStatus'
    ? getResidenceLabel(properties.find((property) => property.keys.includes('ascribes_residence_relation'))?.values ?? [])
    : undefined;
  const displayedProperties = residenceLabel && properties.some((property) => property.keys.includes('ascribes_residence_place'))
    ? properties.filter((property) => property.keys.includes('ascribes_residence_place'))
      .map((property) => ({ ...property, label: residenceLabel }))
    : properties;
  return (
    <div className="person-status-summary-content">
      {timespan && (
        <span className="person-status-summary-date">
          <TimespanValue timespan={timespan} boundaries />
        </span>
      )}
      {recordedDates && <RecordedDatesValue dates={recordedDates} />}
      {displayedProperties.length ? displayedProperties.map((property, index) => (
        <PersonSummaryProperty
          key={property.label}
          label={isOccupation && index === 0 ? undefined : property.label}
          value={(
            <StatusValues
              values={property.values}
              linked={property.linked}
              stacked={property.stacked}
            />
          )}
        />
      )) : (
        <span className="person-status-summary-label">{isOccupation ? 'Occupation or status not recorded' : group.title}</span>
      )}
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

type PersonDisclosureProps = {
  children?: ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  summary: ReactNode;
};

function PersonDisclosure({
  children,
  className,
  defaultExpanded = false,
  summary,
}: PersonDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();
  const summaryId = useId();
  const actionLabelId = useId();
  const classes = `person-status${className ? ` ${className}` : ''}`;

  if (!children || (Array.isArray(children) && !children.some(Boolean))) {
    return (
      <div className={classes}>
        <div className="person-status-summary">{summary}</div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className="person-status-header">
        <div id={summaryId} className="person-status-summary">{summary}</div>
        <span id={actionLabelId} className="person-disclosure-action-label">Details for</span>
        <ObjectCardDisclosureButton
          aria-controls={contentId}
          aria-expanded={isExpanded}
          aria-labelledby={`${actionLabelId} ${summaryId}`}
          className="person-status-toggle"
          onPress={() => setIsExpanded((expanded) => !expanded)}
        />
      </div>
      <div
        id={contentId}
        hidden={!isExpanded}
        className="person-status-content"
      >
        {children}
      </div>
    </div>
  );
}

function hasStatusDetails(status: LinkedArtNode, group: StatusGroup): boolean {
  return getAdditionalStatusProperties(status, group).length > 0
    || getStatusValues(status, ['has_geographic_scope']).length > 0
    || getStatusValues(status, ['classified_as']).length > 0
    || getVisibleSources(status).length > 0
    || getNotes(status).length > 0;
}

function hasStatusValues(status: LinkedArtNode, group: StatusGroup): boolean {
  return group.properties.some((property) =>
    getStatusValues(status, property.keys).length > 0,
  ) || getAdditionalStatusProperties(status, group).length > 0
    || getStatusValues(status, ['has_geographic_scope']).length > 0
    || getStatusValues(status, ['classified_as']).length > 0
    || !!getPersonTimespan(status)
    || !!getRecordedDates(status)
    || group.type !== 'ResidentialStatus' && getVisibleSources(status).length > 0
    || getNotes(status).length > 0;
}

function getStatusNodes(
  entity: LinkedArtNode,
  definition: Pick<StatusDefinition, 'key' | 'type'>,
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
    .filter((source) => isVisibleSource(source, true));
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

function getAdditionalStatusProperties(
  status: LinkedArtNode,
  group: StatusGroup,
) {
  const configuredKeys = new Set(
    group.properties.flatMap((property) => property.keys),
  );
  return Object.keys(status)
    .filter(
      (key) =>
        key.includes('ascribes_') &&
        !key.includes('_relation') &&
        !configuredKeys.has(key),
    )
    .map((key) => ({
      key,
      label: getPropertyLabel(key),
      values: getStatusValues(status, [key]),
    }))
    .filter((property) => property.values.length);
}

function getPropertyLabel(key: string): string {
  const prefix = 'ascribes_';
  const words = key
    .slice(key.indexOf(prefix) + prefix.length)
    .replaceAll('_', ' ');
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
}

function getStatusValueText(value: StatusValue): string {
  return typeof value === 'string'
    ? value
    : getContent(value) ||
        getValue(value.value) ||
        (value.type === 'Type' ? label(value) : '');
}

function getPersonNameRecords(entity: LinkedArtNode) {
  return getStatusNodes(entity, personNameDefinition)
    .flatMap((status, statusIndex) =>
      getStatusValues(status, [
        'ascribes_appellation',
        'aaao:ZP6_ascribes_appellation',
      ]).map((value, valueIndex) => ({
        key: `${status.id ?? statusIndex}-${valueIndex}`,
        name: getStatusValueText(value),
        status,
      })),
    )
    .filter((record) => !!record.name);
}

function sortPersonNames<T extends { name: string; status: LinkedArtNode }>(records: T[]): T[] {
  return [...records].sort((left, right) =>
    Number(isPreferredPersonName(right.status)) - Number(isPreferredPersonName(left.status)),
  );
}
