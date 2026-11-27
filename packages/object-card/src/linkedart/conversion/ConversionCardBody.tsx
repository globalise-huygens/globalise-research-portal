import {
  findByPath,
  findTimespan,
  getContent,
  getStatusValues,
  getValue,
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
import { getAdditionalDates } from '../TimespanFormat.ts';
import { EntityReferencePanel } from '../EntityReferencePanel.tsx';
import { RecordedDatesValue } from '../RecordedDatesValue.tsx';
import { RelationLink } from '../RelationLink.tsx';
import { SourceList } from '../SourceList.tsx';
import { TimespanValue } from '../TimespanValue.tsx';
import { getPlaceEvidence } from '../place/PlaceEvidence.ts';
import { PlaceRecord } from '../place/PlaceRecord.tsx';
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

type ExchangeDimensions = {
  from: ConversionDimension[];
  to: ConversionDimension[];
};

export function ConversionCardBody({ entity }: { entity: LinkedArtNode }) {
  const exchanges = findByPath(entity, ['intentionally_initiated']);
  const timespan = findTimespan(entity);
  const dates = getAdditionalDates(entity, timespan);
  const locations = findByPath(entity, ['is_event_location_subject_of']);
  const { notes, sources } = getPlaceEvidence(entity);
  const classifications = getStatusValues(entity, ['classified_as']);
  const hasDetails = exchanges.length > 0 || !!timespan || !!dates
    || locations.length > 0 || classifications.length > 0;
  const hasEvidence = notes.length > 0 || sources.length > 0;

  return <ObjectCardBody>
    <ObjectCardPanel side="left">
      {hasDetails && (
        <ObjectCardSection title="Conversion details" collapsible>
          <div className="person-status-list">
            {timespan && <ObjectCardDisclosure summary={
              <SummaryProperty label="Date">
                <TimespanValue timespan={timespan} mode="event" />
              </SummaryProperty>
            }>
              <ObjectCardPropertyList className="person-status-details">
                <ObjectCardProperty
                  label="Date bounds"
                  value={<TimespanValue timespan={timespan} mode="boundaries" />}
                />
              </ObjectCardPropertyList>
            </ObjectCardDisclosure>}
            {dates && <ObjectCardDisclosure summary={
              <SummaryProperty label="Date">
                <RecordedDatesValue dates={dates} />
              </SummaryProperty>
            } />}
            {locations.map((record, index) => <PlaceRecord
              key={record.id ?? index}
              record={record}
              title="Recorded location"
            />)}
            {exchanges.map((exchange, index) => (
              <ExchangeDisclosure key={exchange.id ?? index} exchange={exchange} />
            ))}
            {!!classifications.length && <ObjectCardDisclosure summary={
              <SummaryProperty label="Classification">
                <PlaceValues values={classifications} />
              </SummaryProperty>
            } />}
          </div>
        </ObjectCardSection>
      )}
      {hasEvidence && <ObjectCardSection
        title="Further information" collapsible
      >
        <div className="person-status-list">
          {!!notes.length && <ObjectCardDisclosure summary={
            <span className="person-status-summary-value">Notes</span>
          }>
            <ObjectCardPropertyList className="person-status-details">
              <ObjectCardProperty label="Notes" value={notes.join('\n\n')} />
            </ObjectCardPropertyList>
          </ObjectCardDisclosure>}
          {!!sources.length && <ObjectCardDisclosure summary={
            <span className="person-status-summary-value">Sources</span>
          }>
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

export function getConversionTitle(entity: LinkedArtNode): string {
  const names = findByPath(entity, ['identified_by'])
    .filter((identifier) => identifier.type === 'Name')
    .map(getContent);
  return [...names, getContent(entity)].find(Boolean) ?? 'Name not recorded';
}

export function ConversionOverview({ entity }: { entity: LinkedArtNode }) {
  const exchanges = findByPath(entity, ['intentionally_initiated'])
    .map(getExchangeDimensions)
    .filter(({ from, to }) => from.length > 0 || to.length > 0);
  if (!exchanges.length) {
    return null;
  }
  return <div className="person-overview conversion-overview">
    {exchanges.map((dimensions, index) => <span
      className="conversion-overview-fact" key={index}
    >
      <ExchangeSummary {...dimensions} />
    </span>)}
  </div>;
}

function ExchangeDisclosure({ exchange }: { exchange: LinkedArtNode }) {
  const dimensions = getExchangeDimensions(exchange);
  const { from, to } = dimensions;
  return <ObjectCardDisclosure
    className="conversion-summary"
    summary={<ExchangeSummary {...dimensions} />}
  >
    <ObjectCardPropertyList className="person-status-details">
      {from.map((dimension, index) => <DimensionDetails
        key={`from-${index}`} dimension={dimension} label="From"
      />)}
      {to.map((dimension, index) => <DimensionDetails
        key={`to-${index}`} dimension={dimension} label="To"
      />)}
    </ObjectCardPropertyList>
  </ObjectCardDisclosure>;
}

function getExchangeDimensions(exchange: LinkedArtNode): ExchangeDimensions {
  const from = findByPath(exchange, ['has_exchange_value_subject'])
    .map(getDimension);
  const to = findByPath(exchange, ['ascribes_exchange_value_equivalent'])
    .map(getDimension);
  return { from, to };
}

function ExchangeSummary({ from, to }: ExchangeDimensions) {
  return <>
    {from.map((dimension, index) => <SummaryProperty
      key={`from-${index}`} label="From" separator=" "
    >
      <DimensionSummary dimension={dimension} />
    </SummaryProperty>)}
    {!!from.length && !!to.length && ' · '}
    {to.map((dimension, index) => <SummaryProperty
      key={`to-${index}`} label="To" separator=" "
    >
      <DimensionSummary dimension={dimension} />
    </SummaryProperty>)}
    {!from.length && !to.length && 'Exchange value not recorded'}
  </>;
}

function DimensionDetails({ dimension, label: side }: {
  dimension: ConversionDimension;
  label: 'From' | 'To';
}) {
  const originalName = getDimensionName(dimension, 'http://vocab.getty.edu/aat/300417204');
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
    {originalName && <ObjectCardProperty
      label={`${side} original name`} value={originalName}
    />}
    {!!dimension.commodities.length && <ObjectCardProperty
      label={`${side} commodities`}
      value={<PlaceValues values={dimension.commodities} />}
    />}
  </>;
}

function getDimension(node: LinkedArtNode): ConversionDimension {
  return {
    names: findByPath(node, ['identified_by'])
      .filter((identifier) => identifier.type === 'Name'),
    value: getValue(node.value) || undefined,
    lowerValue: getValue(node.lower_value_limit) || undefined,
    upperValue: getValue(node.upper_value_limit) || undefined,
    unit: findByPath(node, ['unit'])[0],
    commodities: findByPath(node, ['is_dimension_of_commodity_type']),
  };
}

function DimensionSummary({ dimension }: { dimension: ConversionDimension }) {
  const amount = formatDimensionAmount(dimension);
  const name = getDimensionName(dimension, 'http://vocab.getty.edu/aat/300458887');
  const unitContent = dimension.unit ? getContent(dimension.unit) : '';
  const fallback = name || unitContent;
  if (!amount && !dimension.unit?.id && !fallback) {
    return <>Value not recorded</>;
  }
  return <>
    {amount && <>{amount} </>}
    {dimension.unit?.id
      ? <RelationLink node={dimension.unit} />
      : fallback}
  </>;
}

function getDimensionName(
  dimension: ConversionDimension,
  classificationId: string,
): string {
  const name = dimension.names.find((item) =>
    findByPath(item, ['classified_as']).some((classification) =>
      classification.id === classificationId,
    ),
  );
  return name ? getContent(name) : '';
}

function formatDimensionAmount(
  dimension: ConversionDimension,
): string | undefined {
  const lower = dimension.lowerValue ?? dimension.value;
  const upper = dimension.upperValue ?? dimension.value;
  if (lower && upper && lower !== upper) {
    return `${lower}–${upper}`;
  }
  return lower ?? upper;
}
