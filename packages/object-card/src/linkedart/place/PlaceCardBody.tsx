import {
  findByPath,
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
import {
  eventKeys,
  relationKeys,
  statusKeys,
  placeDetailGroups,
} from '../LabeledKey.ts';
import { EntityReferencePanel } from '../EntityReferencePanel.tsx';
import { SourceList } from '../SourceList.tsx';
import { PlaceValues } from './PlaceValues.tsx';
import { getPlaceEvidence } from './PlaceEvidence.ts';
import { PlaceGeometry } from './PlaceGeometry.tsx';
import { PlaceRecord } from './PlaceRecord.tsx';
import { SummaryProperty } from './SummaryProperty.tsx';

export function PlaceCardBody({ entity }: { entity: LinkedArtNode }) {
  const locations = findByPath(entity, [
    'is_approximated_by_declarative_place',
  ]);
  const definitions = findByPath(entity, ['place_is_defined_by']);
  const { sources, notes } = getPlaceEvidence(entity);
  const details = placeDetailGroups.flatMap(({ key, label: title }) =>
    findByPath(entity, [key]).map((record) => ({ record, title })));
  const classifications = getStatusValues(entity, ['classified_as']);
  const detailKeys = new Set(placeDetailGroups.map(({ key }) => key));
  const otherStatusGroups = statusKeys.filter(({ key }) =>
    !detailKeys.has(key));
  const groups = [
    ...otherStatusGroups,
    { key: 'is_topographical_subject_of', label: 'Geographical relationships' },
  ];
  const hasDetails = details.length > 0 || classifications.length > 0
    || definitions.length > 0 || locations.length > 0;
  const hasEvidence = notes.length > 0 || sources.length > 0;

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {hasDetails && <ObjectCardSection title="Place details" collapsible>
        <div className="person-status-list">
          {!!classifications.length && <ObjectCardDisclosure summary={
            <SummaryProperty label="Classifications">
              <PlaceValues values={classifications} />
            </SummaryProperty>
          } />}
          {details.map(({ record, title }, index) => <PlaceRecord
            key={record.id ?? index}
            record={record}
            title={title}
          />)}
          {!!definitions.length && <ObjectCardDisclosure
            summary="Recorded coordinates"
          >
            <PlaceGeometry expressions={definitions} />
          </ObjectCardDisclosure>}
          {locations.map((location, index) => <PlaceRecord
            key={location.id ?? `location-${index}`}
            record={location}
            title="Recorded location"
            classificationLabel="Certainty"
          >
            <PlaceGeometry expressions={findByPath(location, [
              'place_is_defined_by',
            ])} />
          </PlaceRecord>)}
        </div>
      </ObjectCardSection>}
      {groups.map(({ key, label: title }) => {
        const records = findByPath(entity, [key]);
        return !!records.length && <ObjectCardSection
          key={key} title={title} collapsible
        >
          <div className="person-status-list">
            {records.map((record, index) => <PlaceRecord
              key={record.id ?? index} record={record}
            />)}
          </div>
        </ObjectCardSection>;
      })}
      {eventKeys.map(({ key, label: title }) => {
        const events = findByPath(entity, [key]);
        return !!events.length && <ObjectCardSection
          key={key} title={title} collapsible
        >
          <div className="person-status-list">
            {events.map((record, index) => <PlaceRecord
              key={record.id ?? index} record={record} title={title}
            />)}
          </div>
        </ObjectCardSection>;
      })}
      {relationKeys.map(({ key, label: title }) => {
        const nodes = findByPath(entity, [key]);
        return !!nodes.length && <ObjectCardSection
          key={key} title={title} collapsible
        >
          <ObjectCardPropertyList>
            <ObjectCardProperty
              label={title} value={<PlaceValues values={nodes} />}
            />
          </ObjectCardPropertyList>
        </ObjectCardSection>;
      })}
      {hasEvidence && <ObjectCardSection
        title="Further information" collapsible
      >
        <div className="person-status-list">
          {!!notes.length && <ObjectCardDisclosure summary="Notes">
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Notes" value={notes.join('\n\n')} />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
          {!!sources.length && <ObjectCardDisclosure summary="Sources">
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty
                label="Sources" value={<SourceList sources={sources} />}
              />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
        </div>
      </ObjectCardSection>}
    </ObjectCardPanel>
    <EntityReferencePanel entity={entity} />
  </ObjectCardBody>;
}
