import { findByPath, findTimespan, getContent, getEntityTitle, label, type LinkedArtNode } from '@globalise/common';
import { ObjectCardBody, ObjectCardDisclosure, ObjectCardPanel, ObjectCardProperty, ObjectCardPropertyList, ObjectCardSection } from '@globalise/design';
import { NodeList } from './NodeList.tsx';
import { getPersonNameRecords, sortPersonNames } from './PersonStatusModel.ts';
import { PersonReferencePanel } from './PersonReferencePanel.tsx';
import { RelationLink } from './RelationLink.tsx';
import { getNotes, SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';
import { relationKeys, statusKeys } from './LabeledKey.ts';
import { StatusSection } from './StatusSection.tsx';

export function getShipTitle(entity: LinkedArtNode): string {
  const preferred = findByPath(entity, ['is_appellative_subject_of', 'ascribes_appellation'])
    .find((name) => findByPath(name, ['classified_as']).some((type) => type.id === 'http://vocab.getty.edu/aat/300404670'));
  return [preferred && getContent(preferred), sortPersonNames(getPersonNameRecords(entity))[0]?.name, getEntityTitle(entity)]
    .find((value) => !!value) ?? 'Name not recorded';
}

export function ShipCardBody({ entity }: { entity: LinkedArtNode }) {
  const names = sortPersonNames(getPersonNameRecords(entity));
  const events = [
    ...findByPath(entity, ['produced_by']).map((event) => ({ event, fallback: 'Built' })),
    ...findByPath(entity, ['transformed_by']).map((event) => ({ event, fallback: 'Change' })),
    ...findByPath(entity, ['taken_out_of_existence_by']).map((event) => ({ event, fallback: 'End of service' })),
  ].filter(({ event }) => hasEventInformation(event));
  const voyages = findByPath(entity, ['moved_by']);
  const sources = findByPath(entity, ['referred_to_by']);
  const notes = getNotes(entity);

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {!!names.length && <ObjectCardSection title="Names" collapsible>
        <div className="person-status-list">
          {names.map(({ key, name, status }) => <ObjectCardDisclosure key={key} summary={name}>
            <SourceList sources={findByPath(status, ['referred_to_by'])} includeInternalLabels showNotes />
          </ObjectCardDisclosure>)}
        </div>
      </ObjectCardSection>}
      {!!events.length && <ObjectCardSection title="Ship history" collapsible>
        <div className="person-status-list">
          {events.map(({ event, fallback }, index) => <ShipEvent key={event.id ?? index} event={event} fallback={fallback} />)}
        </div>
      </ObjectCardSection>}
      {!!notes.length && <ObjectCardSection title="Notes" collapsible>
        {notes.map((note) => <p key={note}>{note}</p>)}
      </ObjectCardSection>}
      {!!sources.length && <ObjectCardSection title="Sources" collapsible>
        <SourceList sources={sources} includeInternalLabels showNotes />
      </ObjectCardSection>}
      <NodeList title="Voyages" nodes={voyages} />
      {statusKeys.filter(({ key }) => key !== 'is_appellative_subject_of').map((item) => (
        <StatusSection key={item.key} entity={entity} labeledKey={item} />
      ))}
      {relationKeys.filter(({ key }) => key !== 'moved_by').map((item) => (
        <NodeList key={item.key} title={item.label} nodes={findByPath(entity, [item.key])} />
      ))}
    </ObjectCardPanel>
    <PersonReferencePanel entity={entity} />
  </ObjectCardBody>;
}

function ShipEvent({ event, fallback }: { event: LinkedArtNode; fallback: string }) {
  const eventLabel = findByPath(event, ['classified_as']).map(label).filter(Boolean).join(', ') || fallback;
  const places = findByPath(event, ['took_place_at']);
  const sources = findByPath(event, ['referred_to_by']);
  const notes = getNotes(event);
  const timespan = findTimespan(event);
  const content = getContent(event);
  return <ObjectCardDisclosure summary={eventLabel}>
    <ObjectCardPropertyList>
      {timespan && <ObjectCardProperty label="Date" value={<TimespanValue timespan={timespan} mode="event" />} />}
      {content && <ObjectCardProperty label="Description" value={content} />}
      {!!places.length && <ObjectCardProperty label="Place" value={places.map((place, index) => <span key={place.id ?? index}>
        {index > 0 && ', '}<RelationLink node={place} />
      </span>)} />}
      {!!notes.length && <ObjectCardProperty label="Notes" value={notes.join('; ')} />}
      {!!sources.length && <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes />} />}
    </ObjectCardPropertyList>
  </ObjectCardDisclosure>;
}

function hasEventInformation(event: LinkedArtNode): boolean {
  return !!findTimespan(event) || !!getContent(event) || getNotes(event).length > 0
    || findByPath(event, ['took_place_at']).length > 0 || findByPath(event, ['referred_to_by']).length > 0;
}
