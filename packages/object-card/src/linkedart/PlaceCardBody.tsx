import type { ReactNode } from 'react';
import { findByPath, findTimespan, getRecordedDates, getContent, getEntityTitle, getStatusValues, isLinkedArtNode, label, type LinkedArtNode, type StatusValue } from '@globalise/common';
import { ObjectCardBody, ObjectCardDisclosure, ObjectCardPanel, ObjectCardProperty, ObjectCardPropertyList, ObjectCardSection } from '@globalise/design';
import { eventKeys, getStatusProperties, relationKeys, statusKeys, placeDetailGroups } from './LabeledKey.ts';
import { EntityReferencePanel } from './EntityReferencePanel.tsx';
import { getPersonNameRecords } from './PersonStatusModel.ts';
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { getNotes, SourceList } from './SourceList.tsx';
import { RecordedDatesValue } from './RecordedDatesValue.tsx';
import { TimespanValue } from './TimespanValue.tsx';

export function PlaceOverview({ entity }: { entity: LinkedArtNode }) {
  const title = getEntityTitle(entity);
  const recordedNames = getPersonNameRecords(entity).map(({ name }) => name);
  const names = [...new Set(recordedNames)].filter((name) => name !== title);
  const certainty = findByPath(entity, [
    'is_approximated_by_declarative_place',
    'classified_as',
  ]);
  if (!names.length && !certainty.length) {
    return null;
  }
  return <div className="person-overview">
    {!!names.length && <span className="person-overview-fact">
      also: {names.join(', ')}
    </span>}
    {!!certainty.length && <span className="person-overview-fact">
      <PlaceValues values={certainty} linked={false} />
    </span>}
  </div>;
}

export function PlaceCardBody({ entity }: { entity: LinkedArtNode }) {
  const locations = findByPath(entity, ['is_approximated_by_declarative_place']);
  const definitions = findByPath(entity, ['place_is_defined_by']);
  const { sources, notes } = getPlaceEvidence(entity);
  const details = placeDetailGroups.flatMap(({ key, label: title }) =>
    findByPath(entity, [key]).map((record) => ({ record, title })));
  const classifications = getStatusValues(entity, ['classified_as']);
  const detailKeys = new Set(placeDetailGroups.map(({ key }) => key));
  const otherStatusGroups = statusKeys.filter(({ key }) => !detailKeys.has(key));
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
          {!!classifications.length && <ObjectCardDisclosure summary={<span className="person-status-summary-property">
            <span className="person-status-summary-label">Classifications: </span>
            <span className="person-status-summary-value">
              <PlaceValues values={classifications} />
            </span>
          </span>} />}
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
        return !!records.length && <ObjectCardSection key={key} title={title} collapsible>
          <div className="person-status-list">
            {records.map((record, index) => <PlaceRecord key={record.id ?? index} record={record} />)}
          </div>
        </ObjectCardSection>;
      })}
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
      {hasEvidence && <ObjectCardSection title="Further information" collapsible>
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
    <EntityReferencePanel entity={entity} />
  </ObjectCardBody>;
}

type PlaceRecordProps = {
  record: LinkedArtNode;
  title?: string;
  children?: ReactNode;
  classificationLabel?: string;
};

function PlaceRecord({
  record,
  title,
  children,
  classificationLabel = 'Classification',
}: PlaceRecordProps) {
  const properties = getStatusProperties(record);
  const missingClassification = record.type === 'ClassificatoryStatus'
    && !getStatusValues(record, ['ascribes_classification']).length;
  const timespan = findTimespan(record);
  const dates = timespan ? null : getRecordedDates(record);
  const classifications = [...getStatusValues(record, ['classified_as']),
    ...findByPath(record, ['ascribes_appellation', 'classified_as'])];
  const { sources, notes } = getPlaceEvidence(record);
  const places = [
    ...findByPath(record, ['has_geographic_scope']),
    ...findByPath(record, ['took_place_at']),
  ];
  const content = getContent(record);
  const isTopographical = record.type === 'TopographicalStatus';
  const isSimilarity = record.type === 'SimilarityStatus';
  let relationshipTarget: string | undefined;
  if (isTopographical) {
    relationshipTarget = 'ascribes_place';
  } else if (isSimilarity) {
    relationshipTarget = 'ascribes_similarity_target';
  }
  const targets = relationshipTarget
    ? getStatusValues(record, [relationshipTarget])
    : [];
  const relationshipKey = isSimilarity
    ? 'ascribes_similarity_relation'
    : 'ascribes_topographical_relation';
  let relationship = getStatusValues(record, [relationshipKey]);
  if (isTopographical && classifications.length) {
    relationship = classifications;
  }
  const combinedRelationships = isTopographical
    && relationship.length > 1 && targets.length > 1;
  const recordedLabels = Array.isArray(record._label)
    ? record._label
    : [record._label];
  const statements = combinedRelationships
    ? recordedLabels.filter((value): value is string =>
      typeof value === 'string')
    : [];
  const primaryProperty = properties[0];
  const summaryValues = relationshipTarget
    ? targets
    : primaryProperty?.values ?? classifications;
  let summaryLabel: ReactNode;
  let summaryValue: ReactNode;
  let separator = ': ';
  if (missingClassification) {
    summaryLabel = title ?? 'Classifications';
    summaryValue = 'Value unavailable';
  } else {
    summaryLabel = getPlaceRecordSummaryLabel({
      combinedRelationships,
      relationshipTarget,
      relationship,
      fallback: title ?? primaryProperty?.label ?? 'Recorded information',
    });
    summaryValue = <PlaceValues values={summaryValues} />;
    separator = relationshipTarget ? ' ' : ': ';
  }
  const valueClassName = !missingClassification
    && record.type === 'AppellativeStatus'
    ? 'person-status-summary-value person-name-value'
    : 'person-status-summary-value';
  return <ObjectCardDisclosure summary={<span className="person-status-summary-content">
    {timespan && <span className="person-status-summary-date"><TimespanValue timespan={timespan} mode="summary" /></span>}
    {dates && <RecordedDatesValue dates={dates} />}
    <span className="person-status-summary-property">
      <span className="person-status-summary-label">
        {summaryLabel}{separator}
      </span>
      <span className={valueClassName}>{summaryValue}</span>
    </span>
  </span>}>
    <ObjectCardPropertyList className="person-status-details">
      {!!statements.length && <ObjectCardProperty label="Recorded statements" value={<span className="timespan-boundaries">{statements.map((statement) => <span key={statement}>{statement}</span>)}</span>} />}
      {content && <ObjectCardProperty label="Description" value={content} />}
      {properties.map((property) => {
        const isRelationship = property.keys.some((key) =>
          key.endsWith('_relation'));
        return <ObjectCardProperty
          key={property.keys.join(',')}
          label={property.label}
          value={<PlaceValues
            values={property.values}
            linked={!isRelationship}
          />}
        />;
      })}
      {!!classifications.length && <ObjectCardProperty label={classificationLabel} value={<PlaceValues values={classifications} />} />}
      {timespan && <ObjectCardProperty label="Date bounds" value={<TimespanValue timespan={timespan} mode="boundaries" />} />}
      {dates && <ObjectCardProperty label="Dates" value={<RecordedDatesValue dates={dates} />} />}
      {!!places.length && <ObjectCardProperty label="Geographic scope" value={<PlaceValues values={places} />} />}
      {!!notes.length && <ObjectCardProperty label="Notes" value={notes.join('; ')} />}
      {!!sources.length && <ObjectCardProperty label="Sources" value={<SourceList sources={sources} />} />}
    </ObjectCardPropertyList>
    {children}
  </ObjectCardDisclosure>;
}

function getPlaceRecordSummaryLabel({
  combinedRelationships,
  relationshipTarget,
  relationship,
  fallback,
}: {
  combinedRelationships: boolean;
  relationshipTarget?: string;
  relationship: StatusValue[];
  fallback: string;
}): ReactNode {
  if (combinedRelationships) {
    return 'Related places';
  }
  if (!relationshipTarget) {
    return fallback;
  }
  if (!relationship.length) {
    return 'Related to';
  }
  return <PlaceValues values={relationship} linked={false} />;
}

function PlaceValues({ values, linked = true }: { values: StatusValue[]; linked?: boolean }) {
  return <>{values.map((value, index) => <span key={index}>
    {index > 0 && ', '}<PlaceValue value={value} linked={linked} />
  </span>)}</>;
}

function PlaceValue({ value, linked }: { value: StatusValue; linked: boolean }) {
  if (!isLinkedArtNode(value)) {return <>{value}</>;}
  return linked ? <RelationLink node={value} resolveExternal={false} />
    : <RelationValue node={value} resolveExternal={false} />;
}

function PlaceGeometry({ expressions }: { expressions: LinkedArtNode[] }) {
  return <ObjectCardPropertyList className="person-status-details">
    {expressions.map((expression, index) => {
      const classificationLabels = findByPath(expression, ['classified_as'])
        .map(label)
        .filter(Boolean);
      const title = classificationLabels.join(', ') || 'Coordinates';
      return <ObjectCardProperty
        key={expression.id ?? index}
        label={title}
        value={getPlaceGeometryValue(expression)}
      />;
    })}
  </ObjectCardPropertyList>;
}

function getPlaceGeometryValue(expression: LinkedArtNode) {
  const content = getContent(expression);
  if (content) {
    return content;
  }
  if (typeof expression.as_wkt === 'string') {
    return expression.as_wkt;
  }
  return label(expression);
}

function getPlaceEvidence(node: LinkedArtNode) {
  const references = findByPath(node, ['referred_to_by']);
  const remarks = references.filter(isPlaceRemark);
  const citations = references.filter((reference) => !remarks.includes(reference));
  const remarkCitations = remarks.flatMap((remark) =>
    findByPath(remark, ['referred_to_by']));
  const remarkNotes = remarks.map(getContent).filter(Boolean);
  const notes = [...new Set([...getNotes(node), ...remarkNotes])];
  const sources = mergeCitationEvidence([...citations, ...remarkCitations]);
  return { notes, sources };
}

function isPlaceRemark(reference: LinkedArtNode): boolean {
  const classifications = findByPath(reference, ['classified_as']);
  return classifications.some((type) =>
    type.id === 'http://vocab.getty.edu/aat/300435415');
}

function mergeCitationEvidence(sources: LinkedArtNode[]): LinkedArtNode[] {
  const merged = new Map<string, LinkedArtNode>();
  for (const source of sources) {
    const key = source.id ?? JSON.stringify(source);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, source);
      continue;
    }
    const combined = { ...existing };
    for (const [property, value] of Object.entries(source)) {
      const previous = combined[property];
      if (previous == null) {
        combined[property] = value;
        continue;
      }
      const hasDifferentValue = value != null
        && JSON.stringify(previous) !== JSON.stringify(value);
      if (hasDifferentValue) {
        combined[property] = mergeCitationValues(previous, value);
      }
    }
    merged.set(key, combined);
  }
  return [...merged.values()];
}

function mergeCitationValues(previous: unknown, value: unknown): unknown[] {
  const previousValues = Array.isArray(previous) ? previous : [previous];
  const incomingValues = Array.isArray(value) ? value : [value];
  const values = [...previousValues, ...incomingValues];
  const uniqueValues = new Map(values.map((item) =>
    [JSON.stringify(item), item]));
  return [...uniqueValues.values()];
}
