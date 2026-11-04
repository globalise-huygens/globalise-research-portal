import type { ReactNode } from 'react';
import { findByPath, findTimespan, getContent, getEntityTitle, getStatusValues, isLinkedArtNode, label, url, type LinkedArtNode, type StatusValue } from '@globalise/common';
import { ObjectCardExternalLink, ObjectCardBody, ObjectCardDisclosure, ObjectCardPanel, ObjectCardProperty, ObjectCardPropertyList, ObjectCardSection } from '@globalise/design';
import { eventKeys, getStatusProperties, relationKeys, statusKeys, placeDetailGroups } from './LabeledKey.ts';
import { PersonReferencePanel } from './PersonReferencePanel.tsx';
import { getPersonNameRecords } from './PersonStatusModel.ts';
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { getNotes, SourceList } from './SourceList.tsx';
import { isInternalUri } from '../isInternalUri.ts';
import { TimespanValue } from './TimespanValue.tsx';

export function PlaceOverview({ entity }: { entity: LinkedArtNode }) {
  const names = [...new Set(getPersonNameRecords(entity).map(({ name }) => name))]
    .filter((name) => name !== getEntityTitle(entity));
  return names.length ? <div className="person-overview">
    <span className="person-overview-fact">also: {names.join(', ')}</span>
  </div> : null;
}

export function PlaceCardBody({ entity }: { entity: LinkedArtNode }) {
  const locations = findByPath(entity, ['is_approximated_by_declarative_place']);
  const definitions = findByPath(entity, ['place_is_defined_by']);
  const { sources, notes } = getPlaceEvidence(entity);
  const details = placeDetailGroups.flatMap(({ key, label: title }) =>
    findByPath(entity, [key]).map((record) => ({ record, title })));
  const groups = [...statusKeys.filter(({ key }) => !placeDetailGroups.some((group) => group.key === key)),
    { key: 'is_topographical_subject_of', label: 'Geographical relationships' }];

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {!!details.length && <ObjectCardSection title="Place details" collapsible>
        <div className="person-status-list">
          {details.map(({ record, title }, index) => <PlaceRecord key={record.id ?? index} record={record} title={title} />)}
        </div>
      </ObjectCardSection>}
      {groups.map(({ key, label: title }) => {
        const records = findByPath(entity, [key]);
        return !!records.length && <ObjectCardSection key={key} title={title} collapsible>
          <div className="person-status-list">
            {records.map((record, index) => <PlaceRecord key={record.id ?? index} record={record} />)}
          </div>
        </ObjectCardSection>;
      })}
      {(!!definitions.length || !!locations.length) && <ObjectCardSection title="Location" collapsible>
        <div className="person-status-list">
          {!!definitions.length && <ObjectCardDisclosure summary="Recorded coordinates"><PlaceGeometry expressions={definitions} /></ObjectCardDisclosure>}
          {locations.map((location, index) => <PlaceRecord key={location.id ?? index} record={location} title="Recorded location">
            <PlaceGeometry expressions={findByPath(location, ['place_is_defined_by'])} />
          </PlaceRecord>)}
        </div>
      </ObjectCardSection>}
      {eventKeys.map(({ key, label: title }) => {
        const events = findByPath(entity, [key]);
        return !!events.length && <ObjectCardSection key={key} title={title} collapsible>
          <div className="person-status-list">{events.map((record, index) => <PlaceRecord key={record.id ?? index} record={record} title={title} />)}</div>
        </ObjectCardSection>;
      })}
      {relationKeys.map(({ key, label: title }) => {
        const nodes = findByPath(entity, [key]);
        return !!nodes.length && <ObjectCardSection key={key} title={title} collapsible>
          <ObjectCardPropertyList><ObjectCardProperty label={title} value={<PlaceValues values={nodes} />} /></ObjectCardPropertyList>
        </ObjectCardSection>;
      })}
      {(!!notes.length || !!sources.length) && <ObjectCardSection title="Further information" collapsible>
        <div className="person-status-list">
          {!!notes.length && <ObjectCardDisclosure summary="Notes">
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Notes" value={notes.join('\n\n')} />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
          {!!sources.length && <ObjectCardDisclosure summary="Sources">
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Sources" value={<SourceList sources={sources} />} />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
        </div>
      </ObjectCardSection>}
    </ObjectCardPanel>
    <PersonReferencePanel entity={entity} />
  </ObjectCardBody>;
}

function PlaceRecord({ record, title, children }: { record: LinkedArtNode; title?: string; children?: ReactNode }) {
  const properties = getStatusProperties(record);
  const missingClassification = record.type === 'ClassificatoryStatus'
    && !getStatusValues(record, ['ascribes_classification']).length;
  const timespan = findTimespan(record);
  const classifications = getStatusValues(record, ['classified_as']);
  const { sources, notes } = getPlaceEvidence(record);
  const places = [...findByPath(record, ['has_geographic_scope']), ...findByPath(record, ['took_place_at'])];
  const content = getContent(record);
  const relationshipTarget = record.type === 'TopographicalStatus' ? 'ascribes_place'
    : record.type === 'SimilarityStatus' ? 'ascribes_similarity_target' : undefined;
  const targets = relationshipTarget ? getStatusValues(record, [relationshipTarget]) : [];
  const relationship = record.type === 'TopographicalStatus' && classifications.length
    ? classifications
    : getStatusValues(record, [record.type === 'SimilarityStatus' ? 'ascribes_similarity_relation' : 'ascribes_topographical_relation']);
  return <ObjectCardDisclosure summary={<span className="person-status-summary-content">
    {timespan && <span className="person-status-summary-date"><TimespanValue timespan={timespan} mode="summary" /></span>}
    <span className="person-status-summary-property">
      {missingClassification ? <>
        <span className="person-status-summary-label">{title ?? 'Classifications'}: </span>
        <span className="person-status-summary-value">Value unavailable</span>
      </> : <>
        <span className="person-status-summary-label">{relationshipTarget ? relationship.length ? <PlaceValues values={relationship} linked={false} /> : 'Related to' : title ?? properties[0]?.label ?? 'Recorded information'}{relationshipTarget ? ' ' : ': '}</span>
        <span className={`person-status-summary-value${record.type === 'AppellativeStatus' ? ' person-name-value' : ''}`}>{relationshipTarget ? <PlaceValues values={targets} /> : properties[0] ? <PlaceValues values={properties[0].values} /> : <PlaceValues values={classifications} />}</span>
      </>}
    </span>
  </span>}>
    <ObjectCardPropertyList className="person-status-details">
      {content && <ObjectCardProperty label="Description" value={content} />}
      {properties.map((property) => <ObjectCardProperty key={property.keys.join(',')} label={property.label} value={property.keys.some((key) => key.endsWith('_relation'))
        ? <PlaceValues values={property.values} linked={false} />
        : <PlaceValues values={property.values} />} />)}
      {!!classifications.length && <ObjectCardProperty label={children ? 'Certainty' : 'Classification'} value={<PlaceValues values={classifications} />} />}
      {timespan && <ObjectCardProperty label="Date bounds" value={<TimespanValue timespan={timespan} mode="boundaries" />} />}
      {!!places.length && <ObjectCardProperty label="Geographic scope" value={<PlaceValues values={places} />} />}
      {!!notes.length && <ObjectCardProperty label="Notes" value={notes.join('; ')} />}
      {!!sources.length && <ObjectCardProperty label="Sources" value={<SourceList sources={sources} />} />}
    </ObjectCardPropertyList>
    {children}
  </ObjectCardDisclosure>;
}

function PlaceValues({ values, linked = true }: { values: StatusValue[]; linked?: boolean }) {
  return <>{values.map((value, index) => <span key={index}>{index > 0 && ', '}{isLinkedArtNode(value) ? linked ? <PlaceValue node={value} /> : isInternalUri(url(value)) ? <RelationValue node={value} /> : label(value) : value}</span>)}</>;
}

function PlaceGeometry({ expressions }: { expressions: LinkedArtNode[] }) {
  return <ObjectCardPropertyList className="person-status-details">
    {expressions.map((expression, index) => <ObjectCardProperty key={expression.id ?? index}
      label={findByPath(expression, ['classified_as']).map(label).filter(Boolean).join(', ') || 'Coordinates'}
      value={getContent(expression) || (typeof expression.as_wkt === 'string' ? expression.as_wkt : label(expression))} />)}
  </ObjectCardPropertyList>;
}

function PlaceValue({ node }: { node: LinkedArtNode }) {
  const href = url(node);
  return href && !isInternalUri(href)
    ? <ObjectCardExternalLink href={href}>{getContent(node) || label(node) || href}</ObjectCardExternalLink>
    : <RelationLink node={node} />;
}

function getPlaceEvidence(node: LinkedArtNode) {
  const references = findByPath(node, ['referred_to_by']);
  const remarks = references.filter((reference) => findByPath(reference, ['classified_as'])
    .some((type) => type.id === 'http://vocab.getty.edu/aat/300435415'));
  return {
    notes: [...new Set([...getNotes(node), ...remarks.map(getContent).filter(Boolean)])],
    sources: [...references.filter((reference) => !remarks.includes(reference)),
      ...remarks.flatMap((remark) => findByPath(remark, ['referred_to_by']))],
  };
}
