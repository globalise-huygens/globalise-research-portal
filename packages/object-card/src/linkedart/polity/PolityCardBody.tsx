import {
  findByPath,
  findTimespan,
  getContent,
  getJsonUrl,
  getRecordedDates,
  getStatusValues,
  isLinkedArtNode,
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
import { CardCopyAction } from '../../CardCopyAction.tsx';
import { CardOpenAction } from '../../CardOpenAction.tsx';
import { EntityReferencePanel } from '../EntityReferencePanel.tsx';
import { polityDetailGroups } from '../LabeledKey.ts';
import { getPersonNameRecords } from '../PersonStatusModel.ts';
import { RecordHierarchy } from '../RecordHierarchy.tsx';
import { RecordedDatesValue } from '../RecordedDatesValue.tsx';
import { RelationValue } from '../RelationLink.tsx';
import { getNotes, isVisibleSource, SourceList } from '../SourceList.tsx';
import { formatDateRange } from '../TimespanFormat.ts';
import { TimespanValue } from '../TimespanValue.tsx';
import { getPlaceEvidence } from '../place/PlaceEvidence.ts';
import { PlaceRecord } from '../place/PlaceRecord.tsx';
import { PlaceValues } from '../place/PlaceValues.tsx';

export function PolityCardBody({ entity }: { entity: LinkedArtNode }) {
  const rulerships = findByPath(entity, ['was_subject_population_of']);
  const records = polityDetailGroups.flatMap(({ key, label: title }) =>
    findByPath(entity, [key]).map((record) => ({ record, title })),
  );
  const sources = [
    ...new Map(
      findByPath(entity, ['referred_to_by'])
        .filter((source) => isVisibleSource(source, true, true))
        .map((source) => [JSON.stringify(source), source]),
    ).values(),
  ];
  const notes = getNotes(entity);
  const hasEvidence = notes.length > 0 || sources.length > 0;
  return (
    <ObjectCardBody>
      <ObjectCardPanel side="left">
        {!!records.length && (
          <ObjectCardSection title="Polity details" collapsible>
            <div className="person-status-list">
              {records.map(({ record, title }, index) => (
                <PolityRecord
                  key={record.id ?? index}
                  record={record}
                  title={title}
                />
              ))}
            </div>
          </ObjectCardSection>
        )}
        {!!rulerships.length && (
          <ObjectCardSection title="Dynasties and reigns" collapsible>
            <RecordHierarchy
              records={rulerships}
              renderRecord={(record) => <RulershipRecord record={record} />}
            />
          </ObjectCardSection>
        )}
        {hasEvidence && (
          <ObjectCardSection title="Further information" collapsible>
            <div className="person-status-list">
              {!!notes.length && (
                <ObjectCardDisclosure summary="Notes">
                  <ObjectCardPropertyList className="person-status-details">
                    <ObjectCardProperty
                      label="Notes"
                      value={notes.join('; ')}
                    />
                  </ObjectCardPropertyList>
                </ObjectCardDisclosure>
              )}
              {!!sources.length && (
                <ObjectCardDisclosure summary="Sources">
                  <ObjectCardPropertyList className="person-status-details">
                    <ObjectCardProperty
                      label="Sources"
                      value={
                        <SourceList
                          sources={sources}
                          includeInternalLabels
                          showNotes
                        />
                      }
                    />
                  </ObjectCardPropertyList>
                </ObjectCardDisclosure>
              )}
            </div>
          </ObjectCardSection>
        )}
      </ObjectCardPanel>
      <EntityReferencePanel entity={entity} />
    </ObjectCardBody>
  );
}

export function getPolityTitle(entity: LinkedArtNode): string {
  const names = getPersonNameRecords(entity);
  const preferred = names.find(({ status }) =>
    findByPath(status, ['classified_as']).some(
      (type) => type.id === 'http://vocab.getty.edu/aat/300404670',
    ),
  );
  const recordedTitle = findByPath(entity, ['identified_by'])
    .filter((node) => node.type === 'Name')
    .map(getContent)
    .find(Boolean);
  return (
    preferred?.name ?? recordedTitle ?? names[0]?.name ?? 'Name not recorded'
  );
}

function RulershipRecord({ record }: { record: LinkedArtNode }) {
  const timespan = findTimespan(record);
  const dates = timespan ? null : getRecordedDates(record);
  const rulers = findByPath(record, ['had_sovereign']);
  const sources = findByPath(record, ['referred_to_by']);
  const notes = getNotes(record);
  const statuses = findByPath(record, ['is_successor_status_subject_of']);
  const classifications = getStatusValues(record, ['classified_as']);
  return (
    <ObjectCardDisclosure
      summary={
        <span className="person-status-summary-content">
          <span className="person-status-summary-value">
            <RelationValue node={record} />
          </span>
          {timespan && (
            <span className="person-status-summary-date">
              <TimespanValue timespan={timespan} mode="event" />
            </span>
          )}
          {dates && <RecordedDatesValue dates={dates} />}
        </span>
      }
    >
      <ObjectCardPropertyList className="person-status-details">
        {!!rulers.length && (
          <ObjectCardProperty
            label="Ruler"
            value={<PlaceValues values={rulers} />}
          />
        )}
        {!!classifications.length && (
          <ObjectCardProperty
            label="Classification"
            value={<PlaceValues values={classifications} />}
          />
        )}
        {timespan && (
          <ObjectCardProperty
            label="Date bounds"
            value={<TimespanValue timespan={timespan} mode="boundaries" />}
          />
        )}
        {dates && (
          <ObjectCardProperty
            label="Dates"
            value={<RecordedDatesValue dates={dates} />}
          />
        )}
        {record.id && (
          <ObjectCardProperty
            label="Rulership URI"
            value={
              <span className="record-identifier">
                {record.id}
                <CardCopyAction uri={record.id} label="Copy rulership URI" />
                <CardOpenAction
                  url={getJsonUrl(record.id)}
                  label="Open rulership JSON-LD"
                />
              </span>
            }
          />
        )}
        {!!notes.length && (
          <ObjectCardProperty label="Notes" value={notes.join('; ')} />
        )}
        {!!sources.length && (
          <ObjectCardProperty
            label="Sources"
            value={
              <SourceList sources={sources} includeInternalLabels showNotes />
            }
          />
        )}
      </ObjectCardPropertyList>
      {statuses.map((status, index) => (
        <PlaceRecord
          key={status.id ?? index}
          record={status}
          title="Succession"
        />
      ))}
    </ObjectCardDisclosure>
  );
}

function PolityRecord({
  record,
  title,
}: {
  record: LinkedArtNode;
  title: string;
}) {
  const timespan = isLinkedArtNode(record.timespan) ? record.timespan : null;
  const { notes, sources } = getPlaceEvidence(timespan ?? { type: 'TimeSpan' });
  if (record.type === 'PopulationExistence') {
    return (
      <ExistenceRecord
        record={record}
        title={title}
        notes={notes}
        sources={sources}
      />
    );
  }
  return (
    <PlaceRecord record={record} title={title}>
      {(notes.length > 0 || sources.length > 0) && (
        <ObjectCardPropertyList>
          {!!notes.length && (
            <ObjectCardProperty label="Period notes" value={notes.join('; ')} />
          )}
          {!!sources.length && (
            <ObjectCardProperty
              label="Period sources"
              value={<SourceList sources={sources} showNotes />}
            />
          )}
        </ObjectCardPropertyList>
      )}
    </PlaceRecord>
  );
}

function ExistenceRecord({
  record,
  title,
  notes,
  sources,
}: {
  record: LinkedArtNode;
  title: string;
  notes: string[];
  sources: LinkedArtNode[];
}) {
  const timespan = findTimespan(record);
  const dates = timespan ? null : getRecordedDates(record);
  const evidence = getPlaceEvidence(record);
  const periodNotes = [...new Set([...notes, ...evidence.notes])];
  const periodSources = [...new Map([...sources, ...evidence.sources]
    .map((source) => [JSON.stringify(source), source])).values()];
  const start =
    timespan &&
    formatDateRange(timespan.beginOfTheBegin, timespan.endOfTheBegin, false);
  let end = 'No latest end recorded';
  if (timespan?.endOfTheEnd) {
    end =
      formatDateRange(timespan.beginOfTheEnd, timespan.endOfTheEnd, false) ??
      end;
  }
  return (
    <ObjectCardDisclosure
      summary={
        <span className="person-status-summary-content">
          <span className="person-status-summary-value">{title}</span>
          {start && (
            <span className="person-status-summary-date">Start: {start}</span>
          )}
          {timespan && (
            <span className="person-status-summary-date">End: {end}</span>
          )}
          {dates && <RecordedDatesValue dates={dates} />}
        </span>
      }
    >
      <ObjectCardPropertyList className="person-status-details">
        {timespan && (
          <ObjectCardProperty
            label="Recorded date bounds"
            value={<TimespanValue timespan={timespan} mode="boundaries" />}
          />
        )}
        {dates && (
          <ObjectCardProperty
            label="Recorded dates"
            value={<RecordedDatesValue dates={dates} />}
          />
        )}
        {!!periodNotes.length && (
          <ObjectCardProperty label="Period notes" value={periodNotes.join('; ')} />
        )}
        {!!periodSources.length && (
          <ObjectCardProperty
            label="Period sources"
            value={<SourceList sources={periodSources} showNotes />}
          />
        )}
      </ObjectCardPropertyList>
    </ObjectCardDisclosure>
  );
}
