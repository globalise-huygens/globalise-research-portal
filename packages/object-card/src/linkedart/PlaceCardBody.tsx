import { findByPath, getContent, label, type LinkedArtNode } from '@globalise/common';
import { ObjectCardBody, ObjectCardPanel, ObjectCardProperty, ObjectCardPropertyList, ObjectCardSection } from '@globalise/design';
import { EntitySummary } from './EntitySummary.tsx';
import { eventKeys, relationKeys, statusKeys } from './LabeledKey.ts';
import { EventSection } from './EventSection.tsx';
import { NodeList } from './NodeList.tsx';
import { PersonReferencePanel } from './PersonReferencePanel.tsx';
import { RelationValue } from './RelationLink.tsx';
import { SourceList } from './SourceList.tsx';
import { StatusSection } from './StatusSection.tsx';

export function PlaceCardBody({ entity }: { entity: LinkedArtNode }) {
  const locations = findByPath(entity, ['is_approximated_by_declarative_place']);
  const definitions = findByPath(entity, ['place_is_defined_by']);
  const sources = findByPath(entity, ['referred_to_by']);

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      <EntitySummary entity={entity} />
      {statusKeys.map((key) => <StatusSection key={key.key} entity={entity} labeledKey={key} />)}
      <StatusSection entity={entity} labeledKey={{ key: 'is_topographical_subject_of', label: 'Geographical relationships' }} />
      {(!!definitions.length || !!locations.length) && <ObjectCardSection title="Location" collapsible>
        {!!definitions.length && <PlaceGeometry expressions={definitions} />}
        {locations.map((location, index) => <div key={location.id ?? index}>
          <PlaceGeometry expressions={findByPath(location, ['place_is_defined_by'])} />
          <ObjectCardPropertyList>
            {!!findByPath(location, ['classified_as']).length && <ObjectCardProperty label="Certainty" value={findByPath(location, ['classified_as']).map((type, index) => <span key={type.id ?? index}>
              {index > 0 && ', '}<RelationValue node={type} />
            </span>)} />}
          </ObjectCardPropertyList>
          <SourceList sources={findByPath(location, ['referred_to_by'])} />
        </div>)}
      </ObjectCardSection>}
      {eventKeys.map((key) => <EventSection key={key.key} entity={entity} labeledKey={key} />)}
      {relationKeys.map((key) => <NodeList key={key.key} title={key.label} nodes={findByPath(entity, [key.key])} />)}
      {!!sources.length && <ObjectCardSection title="Sources" collapsible><SourceList sources={sources} /></ObjectCardSection>}
    </ObjectCardPanel>
    <PersonReferencePanel entity={entity} />
  </ObjectCardBody>;
}

function PlaceGeometry({ expressions }: { expressions: LinkedArtNode[] }) {
  return <ObjectCardPropertyList>
    {expressions.map((expression, index) => <ObjectCardProperty key={expression.id ?? index}
      label={findByPath(expression, ['classified_as']).map(label).filter(Boolean).join(', ') || 'Coordinates'}
      value={getContent(expression) || (typeof expression.as_wkt === 'string' ? expression.as_wkt : label(expression))} />)}
  </ObjectCardPropertyList>;
}
