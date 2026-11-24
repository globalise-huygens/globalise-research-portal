import {
  findByPath,
  findTimespan,
  getContent,
  getRecordedDates,
  getStatusValues,
  getValue,
  isLinkedArtNode,
  label,
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
import type { ReactNode } from 'react';
import { EntityReferencePanel } from '../EntityReferencePanel.tsx';
import { RecordedDatesValue } from '../RecordedDatesValue.tsx';
import { RelationLink } from '../RelationLink.tsx';
import { SourceList } from '../SourceList.tsx';
import { TimespanValue } from '../TimespanValue.tsx';
import { PlaceValues } from '../place/PlaceValues.tsx';
import { SummaryProperty } from '../place/SummaryProperty.tsx';

type ConversionDimension = {
  names: LinkedArtNode[];
  value?: string;
  lowerValue?: string;
  upperValue?: string;
  unit?: LinkedArtNode;
  commodities: LinkedArtNode[];
};

export function ConversionCardBody({ entity }: { entity: LinkedArtNode }) {
  const exchanges = findByPath(entity, ['intentionally_initiated']);
  const timespan = findTimespan(entity);
  const dates = timespan ? null : getRecordedDates(entity);
  const places = findByPath(entity, ['is_event_location_subject_of'])
    .flatMap((status) => getStatusValues(status, ['ascribes_place']));
  const sources = findByPath(entity, ['referred_to_by']);
  const remarkSources = sources.filter((source) =>
    findByPath(source, ['classified_as']).some((classification) =>
      label(classification).toLowerCase().includes('remarks'),
    ),
  );
  const bibliographicSources = sources.filter((source) => !remarkSources.includes(source));
  const classifications = getStatusValues(entity, ['classified_as']);

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {(!!exchanges.length || !!timespan || !!dates || !!places.length || !!classifications.length) && (
        <ObjectCardSection title="Conversion details" collapsible>
          <div className="person-status-list">
            {timespan && <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Date" value={<TimespanValue timespan={timespan} mode="event" />} />
            </ObjectCardPropertyList>}
            {dates && <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Date" value={<RecordedDatesValue dates={dates} />} />
            </ObjectCardPropertyList>}
            {!!places.length && <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Place" value={<PlaceValues values={places} />} />
            </ObjectCardPropertyList>}
            {exchanges.map((exchange, index) => (
              <ExchangeDisclosure key={exchange.id ?? index} exchange={exchange} />
            ))}
            {!!classifications.length && <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Classification" value={<PlaceValues values={classifications} />} />
            </ObjectCardPropertyList>}
          </div>
        </ObjectCardSection>
      )}
      {!!remarkSources.length && <ObjectCardSection title="Remarks" collapsible>
        <SourceList sources={remarkSources} includeInternalLabels showNotes />
      </ObjectCardSection>}
      {!!bibliographicSources.length && <ObjectCardSection title="Sources" collapsible>
        <SourceList sources={bibliographicSources} />
      </ObjectCardSection>}
    </ObjectCardPanel>
    <EntityReferencePanel entity={entity} />
  </ObjectCardBody>;
}

function ExchangeDisclosure({ exchange }: { exchange: LinkedArtNode }) {
  const from = getDimension(findByPath(exchange, ['has_exchange_value_subject'])[0]);
  const to = getDimension(findByPath(exchange, ['ascribes_exchange_value_equivalent'])[0]);
  const summary = <>
    {from && <SummaryProperty label="From" separator=" ">{formatDimensionLabel(from)}</SummaryProperty>}
    {from && to && ' · '}
    {to && <SummaryProperty label="To" separator=" ">{formatDimensionLabel(to)}</SummaryProperty>}
    {!from && !to && label(exchange)}
  </>;

  return <ObjectCardDisclosure
    className="conversion-summary"
    summary={summary}
    defaultExpanded
  >
    <ObjectCardPropertyList className="person-status-details">
      <DimensionDetails dimension={from} label="From" />
      <DimensionDetails dimension={to} label="To" />
    </ObjectCardPropertyList>
  </ObjectCardDisclosure>;
}

function DimensionDetails({ dimension, label: side }: {
  dimension?: ConversionDimension;
  label: 'From' | 'To';
}) {
  if (!dimension) {
    return null;
  }
  const originalName = getDimensionName(dimension, 'original');
  const amount = formatDimensionAmount(dimension);
  return <>
    <ObjectCardProperty
      className={side === 'To' ? 'conversion-target-value' : undefined}
      label={`${side} value`}
      value={amount ?? 'Not recorded'}
    />
    {dimension.unit && <ObjectCardProperty
      label={`${side} unit`}
      value={<RelationLink node={dimension.unit} />}
    />}
    {originalName && <ObjectCardProperty label={`${side} original name`} value={originalName} />}
    {!!dimension.commodities.length && <ObjectCardProperty
      label={`${side} commodities`}
      value={<PlaceValues values={dimension.commodities} />}
    />}
  </>;
}

function getDimension(node?: LinkedArtNode): ConversionDimension | undefined {
  if (!node) {
    return undefined;
  }
  return {
    names: findByPath(node, ['identified_by']).filter((identifier) => identifier.type === 'Name'),
    value: getValue(node.value),
    lowerValue: getValue(node.lower_value_limit),
    upperValue: getValue(node.upper_value_limit),
    unit: findByPath(node, ['unit'])[0],
    commodities: findByPath(node, ['is_dimension_of_commodity_type']),
  };
}

function formatDimensionLabel(dimension?: ConversionDimension): ReactNode {
  if (!dimension) {
    return null;
  }
  const name = dimension.unit && label(dimension.unit);
  return name && (dimension.unit?.id
    ? <RelationLink node={dimension.unit} />
    : name);
}

function getDimensionName(
  dimension: ConversionDimension,
  kind: 'original' | 'standard',
): string | undefined {
  const name = dimension.names.find((name) =>
    getStatusValues(name, ['classified_as']).some((classification) =>
      isLinkedArtNode(classification)
      &&
      label(classification).toLowerCase().includes(kind),
    ),
  );
  return name ? getContent(name) || label(name) : undefined;
}

function formatDimensionAmount(dimension: ConversionDimension): string | undefined {
  const lower = dimension.lowerValue ?? dimension.value;
  const upper = dimension.upperValue ?? dimension.value;
  return lower && upper && lower !== upper ? `${lower}–${upper}` : lower ?? upper;
}
