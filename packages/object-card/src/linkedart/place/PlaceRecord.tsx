import type { ReactNode } from 'react';
import {
  findByPath,
  findTimespan,
  getContent,
  getRecordedDates,
  getStatusValues,
  type LinkedArtNode,
  type StatusValue,
} from '@globalise/common';
import {
  ObjectCardDisclosure,
  ObjectCardProperty,
  ObjectCardPropertyList,
} from '@globalise/design';
import { getStatusProperties, type StatusProperty } from '../LabeledKey.ts';
import { SourceList } from '../SourceList.tsx';
import { RecordedDatesValue } from '../RecordedDatesValue.tsx';
import { TimespanValue } from '../TimespanValue.tsx';
import { PlaceValues } from './PlaceValues.tsx';
import { getPlaceEvidence } from './PlaceEvidence.ts';
import {
  getPlaceRelationship,
  type PlaceRelationship,
} from './PlaceRelationship.ts';
import { SummaryProperty } from './SummaryProperty.tsx';

type PlaceRecordProps = {
  record: LinkedArtNode;
  title?: string;
  children?: ReactNode;
  classificationLabel?: string;
};

export function PlaceRecord({
  record,
  title,
  children,
  classificationLabel = 'Classification',
}: PlaceRecordProps) {
  const properties = getStatusProperties(record);
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
  const relationship = getPlaceRelationship(record, classifications);
  const statements = relationship?.statements ?? [];
  return <ObjectCardDisclosure summary={
    <span className="person-status-summary-content">
      {timespan && <span className="person-status-summary-date">
        <TimespanValue timespan={timespan} mode="summary" />
      </span>}
      {dates && <RecordedDatesValue dates={dates} />}
      <PlaceRecordSummary
        record={record}
        title={title}
        relationship={relationship}
        primaryProperty={properties[0]}
        classifications={classifications}
      />
    </span>
  }>
    <ObjectCardPropertyList className="person-status-details">
      {!!statements.length && <ObjectCardProperty
        label="Recorded statements"
        value={<span className="timespan-boundaries">
          {statements.map((statement) =>
            <span key={statement}>{statement}</span>)}
        </span>}
      />}
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
      {!!classifications.length && <ObjectCardProperty
        label={classificationLabel}
        value={<PlaceValues values={classifications} />}
      />}
      {timespan && <ObjectCardProperty
        label="Date bounds"
        value={<TimespanValue timespan={timespan} mode="boundaries" />}
      />}
      {dates && <ObjectCardProperty
        label="Dates" value={<RecordedDatesValue dates={dates} />}
      />}
      {!!places.length && <ObjectCardProperty
        label="Geographic scope" value={<PlaceValues values={places} />}
      />}
      {!!notes.length && <ObjectCardProperty
        label="Notes" value={notes.join('; ')}
      />}
      {!!sources.length && <ObjectCardProperty
        label="Sources" value={<SourceList sources={sources} />}
      />}
    </ObjectCardPropertyList>
    {children}
  </ObjectCardDisclosure>;
}

type PlaceRecordSummaryProps = {
  record: LinkedArtNode;
  title?: string;
  relationship?: PlaceRelationship;
  primaryProperty?: StatusProperty & { values: StatusValue[] };
  classifications: StatusValue[];
};

function PlaceRecordSummary({
  record,
  title,
  relationship,
  primaryProperty,
  classifications,
}: PlaceRecordSummaryProps) {
  const isClassificatory = record.type === 'ClassificatoryStatus';
  if (isClassificatory && !hasClassification(record)) {
    return <SummaryProperty label={title ?? 'Classifications'}>
      Value unavailable
    </SummaryProperty>;
  }
  if (relationship?.isCombined) {
    return <SummaryProperty label="Related places" separator=" ">
      <PlaceValues values={relationship.targets} />
    </SummaryProperty>;
  }
  if (relationship) {
    const label = <RelationshipLabel types={relationship.types} />;
    return <SummaryProperty label={label} separator=" ">
      <PlaceValues values={relationship.targets} />
    </SummaryProperty>;
  }
  const label = title ?? primaryProperty?.label ?? 'Recorded information';
  const values = primaryProperty?.values ?? classifications;
  const isName = record.type === 'AppellativeStatus';
  return <SummaryProperty label={label} isName={isName}>
    <PlaceValues values={values} />
  </SummaryProperty>;
}

function RelationshipLabel({ types }: { types: StatusValue[] }) {
  if (!types.length) {
    return 'Related to';
  }
  return <PlaceValues values={types} linked={false} />;
}

function hasClassification(record: LinkedArtNode) {
  const classification = getStatusValues(record, ['ascribes_classification']);
  return classification.length > 0;
}
