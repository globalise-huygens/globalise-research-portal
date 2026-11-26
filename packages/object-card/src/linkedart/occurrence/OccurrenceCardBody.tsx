import {
  findByPath,
  findTimespan,
  getContent,
  getEntityTitle,
  getRecordedDates,
  getStatusValues,
  type LinkedArtNode,
} from '@globalise/common';
import {
  ObjectCardBody,
  ObjectCardDisclosure,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { EntityReferencePanel } from '../EntityReferencePanel.tsx';
import { occurrenceDetailGroups } from '../LabeledKey.ts';
import { getPersonNameRecords } from '../PersonStatusModel.ts';
import { RecordedDatesValue } from '../RecordedDatesValue.tsx';
import { getNotes, isVisibleSource, SourceList } from '../SourceList.tsx';
import { TimespanValue } from '../TimespanValue.tsx';
import { PlaceRecord } from '../place/PlaceRecord.tsx';
import { PlaceValues } from '../place/PlaceValues.tsx';
import { SummaryProperty } from '../place/SummaryProperty.tsx';

export function OccurrenceCardBody({ entity }: { entity: LinkedArtNode }) {
  const involved = findByPath(entity, ['involved']);
  const classifications = getStatusValues(entity, ['classified_as']);
  const timespan = findTimespan(entity);
  const dates = timespan ? null : getRecordedDates(entity);
  const sources = findByPath(entity, ['referred_to_by'])
    .filter((source) => isVisibleSource(source, true, true));
  const notes = getNotes(entity);
  const records = occurrenceDetailGroups.flatMap(({ key, label: title }) =>
    findByPath(entity, [key]).map((record) => ({ record, title })),
  );
  const hasDetails = involved.length > 0 || classifications.length > 0
    || !!timespan || !!dates || records.length > 0;

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {hasDetails && <ObjectCardSection title="Occurrence details" collapsible>
        <div className="person-status-list">
          {!!involved.length && <ObjectCardDisclosure summary={
            <SummaryProperty label="Involved">
              <PlaceValues values={involved} />
            </SummaryProperty>
          } />}
          {timespan && <ObjectCardDisclosure summary={
            <SummaryProperty label="Date">
              <TimespanValue timespan={timespan} mode="event" />
            </SummaryProperty>
          }>
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty
                label="Date bounds"
                value={<TimespanValue timespan={timespan} mode="boundaries" />}
              />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
          {dates && <ObjectCardDisclosure summary={
            <SummaryProperty label="Date">
              <RecordedDatesValue dates={dates} />
            </SummaryProperty>
          } />}
          {!!classifications.length && <ObjectCardDisclosure summary={
            <SummaryProperty label="Classification">
              <PlaceValues values={classifications} />
            </SummaryProperty>
          } />}
          {records.map(({ record, title }, index) => <PlaceRecord
            key={record.id ?? index} record={record} title={title}
          />)}
        </div>
      </ObjectCardSection>}
      {!!(notes.length || sources.length) && <ObjectCardSection title="Further information" collapsible>
        <div className="person-status-list">
          {!!notes.length && <ObjectCardDisclosure summary="Notes">
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Notes" value={notes.join('\n\n')} />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
          {!!sources.length && <ObjectCardDisclosure summary="Sources">
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty
                label="Sources"
                value={<SourceList sources={sources} includeInternalLabels showNotes />}
              />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
        </div>
      </ObjectCardSection>}
    </ObjectCardPanel>
    <EntityReferencePanel entity={entity} />
  </ObjectCardBody>;
}

export function getOccurrenceTitle(entity: LinkedArtNode): string {
  const recordedTitle = findByPath(entity, ['identified_by'])
    .filter((identifier) => identifier.type === 'Name')
    .map(getContent)
    .find(Boolean);
  return recordedTitle ?? getEntityTitle(entity);
}

export function OccurrenceOverview({ entity }: { entity: LinkedArtNode }) {
  const title = getOccurrenceTitle(entity);
  const names = [...new Set(getPersonNameRecords(entity).map(({ name }) => name))]
    .filter((name) => name !== title);
  if (!names.length) {
    return null;
  }
  return <div className="person-overview">
    <span className="person-overview-fact">also: {names.join(', ')}</span>
  </div>;
}
