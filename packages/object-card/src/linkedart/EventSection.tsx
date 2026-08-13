import {
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { findByPath, findTimespan, label, LinkedArtNode } from '@globalise/common';
import { LabeledKey } from './LabeledKey.ts';
import { SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';

type EventSectionProps = {
  entity: LinkedArtNode;
  labeledKey: LabeledKey;
};

export function EventSection({ entity, labeledKey }: EventSectionProps) {
  const events = findByPath(entity, [labeledKey.key]);
  if (!events.length) {
    return null;
  }
  return (
    <ObjectCardSection title={labeledKey.label}>
      <ObjectCardPropertyList>
        {events.map((event, i) => (
          <ObjectCardProperty
            key={i}
            label={getEventLabel(event)}
            value={<EventValue event={event}/>}
          />
        ))}
      </ObjectCardPropertyList>
    </ObjectCardSection>
  );
}

type EventValueProps = {
  event: LinkedArtNode;
};

function EventValue({ event }: EventValueProps) {
  return (
    <>
      <TimespanValue timespan={findTimespan(event)}/>
      <SourceList sources={findByPath(event, ['referred_to_by'])}/>
    </>
  );
}

function getEventLabel(event: LinkedArtNode): string {
  const types = findByPath(event, ['classified_as'])
    .map(label)
    .filter((found) => !!found);
  return types.join(', ') || event.type;
}
