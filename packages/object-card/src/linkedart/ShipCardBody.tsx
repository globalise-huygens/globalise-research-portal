import { findByPath, findTimespan, getContent, getEntityIdentifiers, getRecordedDates, getStatusValues, url, type LinkedArtNode } from '@globalise/common';
import { ObjectCardBody, ObjectCardDisclosure, ObjectCardPanel, ObjectCardProperty, ObjectCardPropertyList, ObjectCardSection } from '@globalise/design';
import { NodeList } from './NodeList.tsx';
import { getEntityNameRecords, groupRecords, sortEntityNames } from './EntityStatusModel.ts';
import { EntityReferencePanel } from './EntityReferencePanel.tsx';
import { StatusValues } from './StatusValues.tsx';
import { RelationLink } from './RelationLink.tsx';
import { getNotes, isVisibleSource, SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';
import { RecordedDatesValue } from './RecordedDatesValue.tsx';
import { formatTimespanSummary } from './TimespanFormat.ts';
import { relationKeys, personStatusGroups, statusKeys, shipHistoryGroups, shipNameLabels } from './LabeledKey.ts';
import { StatusSection } from './StatusSection.tsx';
import { EntityStatusGroup } from './EntityStatusGroup.tsx';
import { useQueries } from '@tanstack/react-query';
import { entityResourceQueryOptions } from './RelationValueResolver.ts';
import { buildVoyageHierarchy, type VoyageHierarchyNode } from './ShipVoyageModel';

export function getShipTitle(entity: LinkedArtNode): string {
  const preferred = findByPath(entity, ['is_appellative_subject_of', 'ascribes_appellation'])
    .find((name) => findByPath(name, ['classified_as']).some((type) => type.id === 'http://vocab.getty.edu/aat/300404670'));
  return [preferred && getContent(preferred), sortEntityNames(getEntityNameRecords(entity))[0]?.name]
    .find((value) => !!value) ?? 'Name not recorded';
}

export function ShipOverview({ entity }: { entity: LinkedArtNode }) {
  const title = getShipTitle(entity);
  const names = [...new Set(getEntityNameRecords(entity).map((record) => record.name))]
    .filter((name) => name !== title);
  const history = getShipHistory(entity)
    .filter(({ event }) => !!findTimespan(event) || !!getRecordedDates(event) || findByPath(event, ['took_place_at']).length > 0);
  if (!names.length && !history.length) {return null;}
  return <div className="person-overview">
    {!!names.length && <span className="person-overview-fact">also: {names.join(', ')}</span>}
    {history.map(({ event, fallback }, index) => {
      const places = findByPath(event, ['took_place_at']);
      const timespan = findTimespan(event);
      const dates = timespan ? null : getRecordedDates(event);
      return <span key={event.id ?? index} className="person-overview-fact">
        <ShipEventLabel event={event} fallback={fallback} />: {timespan ? <TimespanValue timespan={timespan} mode="event" /> : dates && <RecordedDatesValue dates={dates} />}
        {(!!timespan || !!dates) && !!places.length && ', '}
        <StatusValues values={places} />
      </span>;
    })}
  </div>;
}

export function ShipCardBody({ entity }: { entity: LinkedArtNode }) {
  const title = getShipTitle(entity);
  const records = sortEntityNames(getEntityNameRecords(entity))
    .sort((left, right) => Number(right.name === title) - Number(left.name === title));
  const names = groupRecords(removeEmptyDuplicateNames(records), (record) => record.name);
  const events = getShipHistory(entity);
  const voyages = findByPath(entity, ['moved_by']);
  const sources = findByPath(entity, ['referred_to_by']);
  const notes = getNotes(entity);
  const identifiers = getEntityIdentifiers(entity);
  const ownership = findByPath(entity, ['is_ownership_subject_of']);
  const ownershipChanges = findByPath(entity, ['changed_ownership_through']);
  const directClassifications = getStatusValues(entity, ['classified_as']);
  const classificationGroup = personStatusGroups.find(({ type }) => type === 'ClassificatoryStatus');

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {(!!names.length || !!events.length) && <ObjectCardSection title="Ship details" collapsible>
        <div className="person-status-list">
          {names.map(({ key, records }) => <ObjectCardDisclosure key={key} summary={<span className="person-status-summary-content">
            {[...new Set(records.flatMap(({ status }) => {
              const timespan = findTimespan(status);
              return timespan ? formatTimespanSummary(timespan) : [];
            }))].map((date) => <span key={date} className="person-status-summary-date">{date}</span>)}
            {records.map(({ key: recordKey, status }) => {
              const dates = findTimespan(status) ? null : getRecordedDates(status);
              return dates && <RecordedDatesValue key={recordKey} dates={dates} />;
            })}
            <span className="person-status-summary-property">
              <span className="person-status-summary-label">{getShipNameLabel(records[0].name, records.map(({ status }) => status))}: </span>
              <span className="person-status-summary-value person-name-value">{records[0].name}</span>
              {records.length > 1 && <span className="person-status-count">{records.length} records</span>}
            </span>
          </span>}>
            {records.map(({ key: recordKey, status }, index) => {
              const sources = findByPath(status, ['referred_to_by']);
              const timespan = findTimespan(status);
              const dates = timespan ? null : getRecordedDates(status);
              const hasSources = sources.some((source) => isVisibleSource(source, true, true, identifiers));
              const notes = getNotes(status);
              const classifications = findByPath(status, ['ascribes_appellation'])
                .filter((name) => getContent(name) === records[0].name)
                .flatMap((name) => findByPath(name, ['classified_as']));
              return <div key={recordKey} className="person-status-record">
                {records.length > 1 && <div className="person-status-label">Record {index + 1}</div>}
                {timespan || dates || hasSources || classifications.length || notes.length ? <ObjectCardPropertyList className="person-status-details">
                  {!!classifications.length && <ObjectCardProperty label="Classification" value={<StatusValues values={classifications} />} />}
                  {timespan && <ObjectCardProperty label="Date bounds" value={<TimespanValue timespan={timespan} mode="boundaries" />} />}
                  {dates && <ObjectCardProperty label="Dates" value={<RecordedDatesValue dates={dates} />} />}
                  {!!notes.length && <ObjectCardProperty label="Notes" value={<StatusValues values={notes} linked={false} stacked />} />}
                  {hasSources && <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes excludedIdentifiers={identifiers} />} />}
                </ObjectCardPropertyList> : <p className="person-status-note">No additional details recorded.</p>}
              </div>;
            })}
          </ObjectCardDisclosure>)}
          {events.map(({ event, fallback }, index) => <ShipEvent key={event.id ?? `history-${index}`} event={event} fallback={fallback} identifiers={identifiers} />)}
        </div>
      </ObjectCardSection>}
      {!!notes.length && <ObjectCardSection title="Notes" collapsible>
        {notes.map((note) => <p key={note}>{note}</p>)}
      </ObjectCardSection>}
      {!!sources.length && <ObjectCardSection title="Sources" collapsible>
        <SourceList sources={sources} includeInternalLabels showNotes excludedIdentifiers={identifiers} />
      </ObjectCardSection>}
      {!!voyages.length && <ObjectCardSection title="Voyages" collapsible>
        <ShipVoyageList voyages={voyages} identifiers={identifiers} />
      </ObjectCardSection>}
      {!!(ownership.length || ownershipChanges.length) && <ObjectCardSection title="Ownership" collapsible>
        <div className="person-status-list">
          {ownership.map((status, index) => <ShipOwnership key={status.id ?? index} status={status} identifiers={identifiers} />)}
          {ownershipChanges.map((event, index) => <ShipEvent key={event.id ?? `change-${index}`} event={event} fallback="Ownership change" identifiers={identifiers} />)}
        </div>
      </ObjectCardSection>}
      {classificationGroup && <EntityStatusGroup
        entity={entity}
        group={classificationGroup}
      >
        {!!directClassifications.length && <ObjectCardDisclosure summary={
          <span className="person-status-summary-property">
            <span className="person-status-summary-label">Object type: </span>
            <span className="person-status-summary-value">
              <StatusValues values={directClassifications} />
            </span>
          </span>
        } />}
      </EntityStatusGroup>}
      {statusKeys.filter(({ key }) => key !== 'is_appellative_subject_of' && key !== 'is_ownership_subject_of' && key !== 'is_classificatory_subject_of').map((item) => (
        <StatusSection key={item.key} entity={entity} labeledKey={item} />
      ))}
      {relationKeys.filter(({ key }) => key !== 'moved_by' && key !== 'changed_ownership_through').map((item) => (
        <NodeList key={item.key} title={item.label} nodes={findByPath(entity, [item.key])} />
      ))}
    </ObjectCardPanel>
    <EntityReferencePanel entity={entity} />
  </ObjectCardBody>;
}

function removeEmptyDuplicateNames<T extends { name: string; status: LinkedArtNode }>(records: T[]): T[] {
  const namesWithDetails = new Set(records
    .filter(({ name, status }) => hasNameRecordDetails(name, status))
    .map(({ name }) => name));
  const seenEmptyNames = new Set<string>();

  return records.filter(({ name, status }) => {
    if (hasNameRecordDetails(name, status)) {
      return true;
    }
    if (namesWithDetails.has(name) || seenEmptyNames.has(name)) {
      return false;
    }
    seenEmptyNames.add(name);
    return true;
  });
}

function hasNameRecordDetails(name: string, status: LinkedArtNode): boolean {
  const hasDates = !!findTimespan(status) || !!getRecordedDates(status);
  const hasSources = findByPath(status, ['referred_to_by']).length > 0;
  const hasNotes = getNotes(status).length > 0;
  const hasClassification = findByPath(status, ['ascribes_appellation'])
    .filter((appellation) => getContent(appellation) === name)
    .some((appellation) => findByPath(appellation, ['classified_as']).length > 0);

  return hasDates || hasSources || hasNotes || hasClassification;
}

function ShipOwnership({ status, identifiers }: { status: LinkedArtNode; identifiers: string[] }) {
  const owners = getStatusValues(status, ['ascribes_owner']);
  const places = findByPath(status, ['has_geographic_scope']);
  const timespan = findTimespan(status);
  const dates = timespan ? null : getRecordedDates(status);
  const sources = findByPath(status, ['referred_to_by']);
  const notes = getNotes(status);
  return <ObjectCardDisclosure summary={<div className="person-status-summary-content">
    {timespan && <span className="person-status-summary-date"><TimespanValue timespan={timespan} mode="summary" /></span>}
    {dates && <RecordedDatesValue dates={dates} />}
    <span className="person-status-summary-property"><span className="person-status-summary-label">{owners.length ? 'Owner: ' : 'Ownership record'}</span>
      {!!owners.length && <span className="person-status-summary-value"><StatusValues values={owners} /></span>}
    </span>
  </div>}>
    <ObjectCardPropertyList className="person-status-details">
      {!!places.length && <ObjectCardProperty label="Geographic scope" value={<StatusValues values={places} />} />}
      {timespan && <ObjectCardProperty label="Date bounds" value={<TimespanValue timespan={timespan} mode="boundaries" />} />}
      {dates && <ObjectCardProperty label="Dates" value={<RecordedDatesValue dates={dates} />} />}
      {!!notes.length && <ObjectCardProperty label="Notes" value={notes.join('; ')} />}
      {!!sources.length && <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes excludedIdentifiers={identifiers} />} />}
    </ObjectCardPropertyList>
  </ObjectCardDisclosure>;
}

function ShipEvent({ event, fallback, identifiers }: { event: LinkedArtNode; fallback: string; identifiers: string[] }) {
  const classifications = findByPath(event, ['classified_as']);
  const places = findByPath(event, ['took_place_at']);
  const transferredFrom = findByPath(event, ['transferred_title_from']);
  const transferredTo = findByPath(event, ['transferred_title_to']);
  const sources = findByPath(event, ['referred_to_by']);
  const notes = getNotes(event);
  const timespan = findTimespan(event);
  const dates = timespan ? null : getRecordedDates(event);
  const content = getContent(event);
  return <ObjectCardDisclosure summary={<div className="person-status-summary-content">
    <span className="person-status-summary-property">
      <span className="person-status-summary-label"><ShipEventLabel event={event} fallback={fallback} />{(timespan ?? dates) && ': '}</span>
      {timespan && <span className="person-status-summary-value"><TimespanValue timespan={timespan} mode="event" /></span>}
      {dates && <RecordedDatesValue dates={dates} />}
    </span>
  </div>}>
    <ObjectCardPropertyList className="person-status-details">
      {!!classifications.length && <ObjectCardProperty label="Event type" value={<StatusValues values={classifications} />} />}
      {content && <ObjectCardProperty label="Description" value={content} />}
      {timespan && <ObjectCardProperty label="Date bounds" value={<TimespanValue timespan={timespan} mode="boundaries" />} />}
      {dates && <ObjectCardProperty label="Dates" value={<RecordedDatesValue dates={dates} />} />}
      {!!places.length && <ObjectCardProperty label="Place" value={<StatusValues values={places} />} />}
      {!!transferredFrom.length && <ObjectCardProperty label="From" value={<StatusValues values={transferredFrom} />} />}
      {!!transferredTo.length && <ObjectCardProperty label="To" value={<StatusValues values={transferredTo} />} />}
      {!!notes.length && <ObjectCardProperty label="Notes" value={notes.join('; ')} />}
      {!!sources.length && <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes excludedIdentifiers={identifiers} />} />}
    </ObjectCardPropertyList>
  </ObjectCardDisclosure>;
}

function ShipVoyageList({ voyages, identifiers }: { voyages: LinkedArtNode[]; identifiers: string[] }) {
  const results = useQueries({
    queries: voyages.map((voyage) => entityResourceQueryOptions(url(voyage) ?? '')),
  });
  const hierarchy = buildVoyageHierarchy(voyages.map((voyage, index) => results[index].data ?? voyage));
  return <ol className="person-status-list ship-voyage-hierarchy">
    {hierarchy.map((node) => <ShipVoyageNode key={node.key} node={node} identifiers={identifiers} />)}
  </ol>;
}

function ShipVoyageNode({ node, identifiers }: { node: VoyageHierarchyNode; identifiers: string[] }) {
  return <li>
    <ShipVoyage voyage={node.voyage} identifiers={identifiers} />
    {!!node.children.length && <ol className="ship-voyage-nested-list">
      {node.children.map((child) => <ShipVoyageNode key={child.key} node={child} identifiers={identifiers} />)}
    </ol>}
  </li>;
}

function ShipVoyage({ voyage, identifiers }: { voyage: LinkedArtNode; identifiers: string[] }) {
  const details = voyage;
  const timespan = findTimespan(details);
  const dates = timespan ? null : getRecordedDates(details);
  const sources = findByPath(details, ['referred_to_by']);
  const from = findByPath(details, ['moved_from']);
  const to = findByPath(details, ['moved_to']);
  return <ObjectCardDisclosure summary={<div className="person-status-summary-content">
    <span className="person-status-summary-value">
      {from.length || to.length ? <>
        From <ShipRoutePlaces places={from} /> to <ShipRoutePlaces places={to} />
      </> : 'Route not recorded'}
      {timespan && <> (<TimespanValue timespan={timespan} mode="event" />)</>}
    </span>
    {dates && <RecordedDatesValue dates={dates} />}
  </div>}>
    <ObjectCardPropertyList className="person-status-details">
      <ObjectCardProperty label="Voyage" value={<RelationLink node={voyage} />} />
      {timespan && <ObjectCardProperty label="Date bounds" value={<TimespanValue timespan={timespan} mode="boundaries" />} />}
      {dates && <ObjectCardProperty label="Dates" value={<RecordedDatesValue dates={dates} />} />}
      {!!from.length && <ObjectCardProperty label="From" value={<StatusValues values={from} />} />}
      {!!to.length && <ObjectCardProperty label="To" value={<StatusValues values={to} />} />}
      {!!sources.length && <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes excludedIdentifiers={identifiers} />} />}
    </ObjectCardPropertyList>
  </ObjectCardDisclosure>;
}

function hasEventInformation(event: LinkedArtNode): boolean {
  return !!findTimespan(event) || !!getRecordedDates(event) || !!getContent(event) || getNotes(event).length > 0
    || findByPath(event, ['classified_as']).length > 0 || findByPath(event, ['took_place_at']).length > 0
    || findByPath(event, ['referred_to_by']).length > 0
    || findByPath(event, ['transferred_title_from']).length > 0 || findByPath(event, ['transferred_title_to']).length > 0;
}

function ShipRoutePlaces({ places }: { places: LinkedArtNode[] }) {
  if (!places.length) {return <>place not recorded</>;}
  return <><StatusValues values={places} /></>;
}

function getShipHistory(entity: LinkedArtNode) {
  return shipHistoryGroups.flatMap(({ key, label: fallback }) =>
    findByPath(entity, [key]).filter(hasEventInformation).map((event) => ({ event, fallback })));
}

function ShipEventLabel({ event, fallback }: { event: LinkedArtNode; fallback: string }) {
  const classifications = findByPath(event, ['classified_as']);
  return classifications.length
    ? <StatusValues values={classifications} />
    : fallback;
}

function getShipNameLabel(name: string, statuses: LinkedArtNode[]): string {
  const labels = new Set(statuses.flatMap((status) => findByPath(status, ['ascribes_appellation'])
    .filter((appellation) => getContent(appellation) === name)
    .flatMap((appellation) => findByPath(appellation, ['classified_as']))
    .flatMap((type) => type.id && shipNameLabels[type.id] ? [shipNameLabels[type.id]] : [])));
  return labels.size === 1 ? [...labels][0] : 'Name';
}
