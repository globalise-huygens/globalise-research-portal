import { hasStatusEvidence, EntityStatusGroup, EntitySummaryProperty, StatusRecordCount, StatusRecordLabel, hasGroupInformation, hasStatusValues, getStatusNodes, StatusValuesProperty, SourcesProperty, getVisibleSources, NotesProperty } from './EntityStatusGroup.tsx';
import { StatusValues } from './StatusValues.tsx';
import { RecordedDatesValue } from './RecordedDatesValue.tsx';
import {
  findByPath,
  findTimespan,
  formatRecordedDate,
  getRecordedDates,
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
import { RelationValue } from './RelationLink.tsx';
import { getNotes, SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';
import { personStatusGroups } from './LabeledKey.ts';
import { EntityReferencePanel } from './EntityReferencePanel.tsx';
import {
  groupRecords,
  getEntityNameRecords,
  sortEntityNames,
  uniqueStatusValues,
} from './EntityStatusModel.ts';

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
  const hasPersonalDetails = getEntityNameRecords(entity).length > 0
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
          <EntityStatusGroup entity={entity} group={occupationGroup} />
        )}
        {locationGroup && (
          <EntityStatusGroup
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
              <EntityStatusGroup
                key={group.label}
                entity={entity}
                group={group}
                section={false}
              />
            ))}
            {!!unassignedDates.length && (
              <ObjectCardDisclosure
                summary={<EntitySummaryProperty label="Recorded status dates" value={unassignedDates.join(', ')} />}
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
                <EntityStatusGroup key={group.label} entity={entity} group={group} section={false} />
              ))}
            </div>
          </ObjectCardSection>
        )}
      </ObjectCardPanel>
      <EntityReferencePanel entity={entity} />
    </ObjectCardBody>
  );
}

export function getPersonTitle(entity: LinkedArtNode): string {
  const [name] = sortEntityNames(getEntityNameRecords(entity))
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
    ...new Set(sortEntityNames(getEntityNameRecords(entity)).map((record) => record.name)),
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
  const groups = groupRecords(getEntityNameRecords(entity), (record) => record.name);
  return <>{groups.map(({ key, records }) => {
    const details = records.some(({ status }) => hasNameDetails(status)) ? records : [];
    return (
      <ObjectCardDisclosure
        key={key}
        summary={(
          <>
            <EntitySummaryProperty
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
          <EntitySummaryProperty
            label={title}
            value={timespan ? <TimespanValue timespan={timespan} mode="event" /> : dates && <RecordedDatesValue dates={dates} />}
          />
          {!!locations.length && (
            <EntitySummaryProperty
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
