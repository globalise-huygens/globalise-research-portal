import {
  findByPath, findTimespan, getContent, getRecordedDates, getStatusValues,
  isLinkedArtNode, label, type LinkedArtNode,
} from '@globalise/common';
import {
  ObjectCardBody, ObjectCardDisclosure, ObjectCardPanel, ObjectCardProperty,
  ObjectCardPropertyList, ObjectCardSection,
} from '@globalise/design';
import { EntityReferencePanel } from '../EntityReferencePanel.tsx';
import { RecordedDatesValue } from '../RecordedDatesValue.tsx';
import { RelationLink } from '../RelationLink.tsx';
import { SourceList } from '../SourceList.tsx';
import { TimespanValue } from '../TimespanValue.tsx';
import { PlaceValues } from '../place/PlaceValues.tsx';

export function OccurrenceCardBody({ entity }: { entity: LinkedArtNode }) {
  const involved = findByPath(entity, ['involved']);
  const classifications = getStatusValues(entity, ['classified_as']);
  const places = findByPath(entity, ['is_event_location_subject_of'])
    .flatMap((status) => getStatusValues(status, ['ascribes_place']));
  const names = findByPath(entity, ['is_appellative_subject_of'])
    .flatMap((status) => getStatusValues(status, ['ascribes_appellation']))
    .flatMap((name) => {
      const types = isLinkedArtNode(name) ? findByPath(name, ['classified_as']).map(label) : [];
      if (types.some((type) => /standard/i.test(type))) {
        return [];
      }
      const title = types.some((type) => /original/i.test(type)) ? 'Original name' : types.filter(Boolean).join(', ') || 'Name';
      const value = isLinkedArtNode(name) ? getContent(name) || label(name) : name;
      return value ? [{ title, value }] : [];
    });
  const timespan = findTimespan(entity);
  const dates = timespan ? null : getRecordedDates(entity);
  const sources = findByPath(entity, ['referred_to_by']);
  const hasDetails = !!timespan || !!dates || !!(names.length || places.length || classifications.length);

  const details = hasDetails && <ObjectCardPropertyList className="person-status-details">
    {timespan && <ObjectCardProperty label="Date" value={<TimespanValue timespan={timespan} mode="event" />} />}
    {dates && <ObjectCardProperty label="Date" value={<RecordedDatesValue dates={dates} />} />}
    {names.map(({ title, value }, index) => <ObjectCardProperty key={index} label={title} value={value} />)}
    {!!places.length && <ObjectCardProperty label="Place" value={<PlaceValues values={places} />} />}
    {!!classifications.length && <ObjectCardProperty label="Classification" value={<PlaceValues values={classifications} />} />}
  </ObjectCardPropertyList>;

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {(!!involved.length || hasDetails) && <ObjectCardSection title="Occurrence details" collapsible>
        <div className="person-status-list">
          {involved.length ? involved.map((commodity, index) => <ObjectCardDisclosure
            key={commodity.id ?? index}
            defaultExpanded
            summary={<span className="person-status-summary-value"><RelationLink node={commodity} /></span>}
          >
            {details}
          </ObjectCardDisclosure>) : details}
        </div>
      </ObjectCardSection>}
      {!!sources.length && <ObjectCardSection title="Sources" collapsible>
        <SourceList sources={sources} />
      </ObjectCardSection>}
    </ObjectCardPanel>
    <EntityReferencePanel entity={entity} />
  </ObjectCardBody>;
}
