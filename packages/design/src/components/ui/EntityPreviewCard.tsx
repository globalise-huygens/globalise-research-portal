import { IconArrowTopRight, IconCopy } from '../icons';
import { cn, useCopy } from '../../lib';
import * as React from 'react';
import { Popover } from './Popover';
import { Tooltip } from './Tooltip';
import { EntityBadge, type EntityBadgeType } from './EntityBadge';

export type EntityPreviewCardAutomationBadge = 'ner' | 'lin';

export type EntityPreviewCardType =
  | 'entity'
  | 'commodity'
  | 'date'
  | 'dimensions'
  | 'document'
  | 'organisation'
  | 'person'
  | 'place'
  | 'polity'
  | 'quantity'
  | 'ship';

export type EntityPreviewCardBaseData = {
  title: React.ReactNode;
  properties?: EntityPreviewCardProperty[];
  badges?: EntityPreviewCardAutomationBadge[];
  icon?: React.ReactNode;
  openFullCardLabel?: string;
  openFullCardHref?: string;
  copyValue?: string;
};

export type EntityPreviewCardEntityData = {
  type: 'entity';
} & EntityPreviewCardBaseData;

export type EntityPreviewCardCommodityData = {
  type: 'commodity';
  commodityType?: React.ReactNode;
  origin?: React.ReactNode;
  unit?: React.ReactNode;
  mentions?: React.ReactNode;
  qualifier?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardDateData = {
  type: 'date';
  normalizedDate?: React.ReactNode;
  calendar?: React.ReactNode;
  period?: React.ReactNode;
  relatedEvent?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardDimensionsData = {
  type: 'dimensions';
  measurementType?: React.ReactNode;
  value?: React.ReactNode;
  unit?: React.ReactNode;
  context?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardDocumentData = {
  type: 'document';
  documentType?: React.ReactNode;
  reference?: React.ReactNode;
  archiveScan?: React.ReactNode;
  collection?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardOrganisationData = {
  type: 'organisation';
  organisationType?: React.ReactNode;
  jurisdiction?: React.ReactNode;
  founded?: React.ReactNode;
  region?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardPersonData = {
  type: 'person';
  role?: React.ReactNode;
  affiliation?: React.ReactNode;
  civicStatus?: React.ReactNode;
  activePeriod?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardPlaceData = {
  type: 'place';
  placeType?: React.ReactNode;
  historicalForm?: React.ReactNode;
  region?: React.ReactNode;
  authority?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardPolityData = {
  type: 'polity';
  polityType?: React.ReactNode;
  region?: React.ReactNode;
  period?: React.ReactNode;
  authority?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardQuantityData = {
  type: 'quantity';
  quantityType?: React.ReactNode;
  amount?: React.ReactNode;
  unit?: React.ReactNode;
  context?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardShipData = {
  type: 'ship';
  shipType?: React.ReactNode;
  built?: React.ReactNode;
  laidUp?: React.ReactNode;
  tonnage?: React.ReactNode;
  voyages?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardData =
  | EntityPreviewCardEntityData
  | EntityPreviewCardCommodityData
  | EntityPreviewCardDateData
  | EntityPreviewCardDimensionsData
  | EntityPreviewCardDocumentData
  | EntityPreviewCardOrganisationData
  | EntityPreviewCardPersonData
  | EntityPreviewCardPlaceData
  | EntityPreviewCardPolityData
  | EntityPreviewCardQuantityData
  | EntityPreviewCardShipData;

export type EntityPreviewCardProps = {
  data: EntityPreviewCardData;
  className?: string;
};

export type EntityPreviewCardProperty = {
  label: string;
  value: React.ReactNode;
};

function getEntityBadgeType(
  type: EntityPreviewCardType,
): EntityBadgeType | 'entity' {
  if (type === 'polity') {
    return 'organisation';
  }

  if (type === 'quantity') {
    return 'dimensions';
  }

  return type;
}

function getEntityBadgeLabel(type: EntityPreviewCardType) {
  switch (type) {
    case 'entity':
      return 'Entity';
    case 'organisation':
      return 'Organisation';
    case 'dimensions':
      return 'Measure';
    default:
      return type;
  }
}

function getAutomationBadges(
  badges: EntityPreviewCardAutomationBadge[] | undefined,
) {
  if (!badges?.includes('ner')) {
    return [];
  }

  return badges.includes('lin')
    ? (['ner', 'lin'] as const)
    : (['ner'] as const);
}

function getEntityPreviewProperties(
  data: EntityPreviewCardData,
): [string, React.ReactNode | undefined][] {
  switch (data.type) {
    case 'person':
      return [
        ['Role', data.role],
        ['Affiliation', data.affiliation],
        ['Status', data.civicStatus],
        ['Period', data.activePeriod],
        ['Mentions', data.mentions],
      ];
    case 'ship':
      return [
        ['Type', data.shipType],
        ['Built', data.built],
        ['Laid up', data.laidUp],
        ['Weight', data.tonnage],
        ['Voyages', data.voyages],
      ];
    case 'organisation':
      return [
        ['Type', data.organisationType],
        ['Jurisdiction', data.jurisdiction],
        ['Founded', data.founded],
        ['Region', data.region],
        ['Mentions', data.mentions],
      ];
    case 'place':
      return [
        ['Type', data.placeType],
        ['Form', data.historicalForm],
        ['Region', data.region],
        ['Authority', data.authority],
        ['Mentions', data.mentions],
      ];
    case 'commodity':
      return [
        ['Type', data.commodityType],
        ['Origin', data.origin],
        ['Unit', data.unit],
        ['Qualifier', data.qualifier],
        ['Mentions', data.mentions],
      ];
    case 'date':
      return [
        ['Date', data.normalizedDate],
        ['Calendar', data.calendar],
        ['Period', data.period],
        ['Event', data.relatedEvent],
        ['Mentions', data.mentions],
      ];
    case 'document':
      return [
        ['Type', data.documentType],
        ['Reference', data.reference],
        ['Archive scan', data.archiveScan],
        ['Collection', data.collection],
        ['Mentions', data.mentions],
      ];
    case 'dimensions':
      return [
        ['Measure', data.measurementType],
        ['Value', data.value],
        ['Unit', data.unit],
        ['Context', data.context],
      ];
    case 'quantity':
      return [
        ['Type', data.quantityType],
        ['Amount', data.amount],
        ['Unit', data.unit],
        ['Context', data.context],
      ];
    case 'polity':
      return [
        ['Type', data.polityType],
        ['Region', data.region],
        ['Period', data.period],
        ['Authority', data.authority],
        ['Mentions', data.mentions],
      ];
    default:
      return [];
  }
}

function EntityPreviewCard({ data, className }: EntityPreviewCardProps) {
  const { copied, copy } = useCopy();
  const properties: EntityPreviewCardProperty[] = getEntityPreviewProperties(
    data,
  )
    .filter(
      (property): property is [string, React.ReactNode] =>
        property[1] !== undefined && property[1] !== null && property[1] !== '',
    )
    .map(([label, value]) => ({ label, value }));
  const automationBadges = getAutomationBadges(data.badges);
  const openFullCardLabel = data.openFullCardLabel ?? 'Open full object card';
  const categoryLabel = getEntityBadgeLabel(data.type);
  const copyValue = data.copyValue;

  function copyIdentifier() {
    if (copyValue) {
      void copy(copyValue);
    }
  }

  return (
    <Popover
      size="compact"
      className={cn('entity-preview-card', className)}
      data-copied={copied ? 'true' : 'false'}
    >
      <div className="header">
        <div className="identity">
          <div className="leading-row">
            <Tooltip
              label={`Category: ${categoryLabel}`}
              placement="top"
            >
              <span
                tabIndex={0}
                role="img"
                aria-label={`Category: ${categoryLabel}`}
                className="category-trigger"
                data-type={getEntityBadgeType(data.type)}
              >
                {data.icon ? (
                  <span className="category-icon">
                    {data.icon}
                  </span>
                ) : (
                  <span className="category-initial">
                    {categoryLabel.slice(0, 1)}
                  </span>
                )}
              </span>
            </Tooltip>
            {automationBadges.map((badge) => (
              <EntityBadge
                key={badge}
                type={badge}
                className="automation-badge"
              >
                {badge.toUpperCase()}
              </EntityBadge>
            ))}
          </div>
          <div className="title">{data.title}</div>
        </div>

        <div className="actions">
          {copyValue && (
            <button
              type="button"
              aria-label={`Copy URI ${copyValue}`}
              className="icon-action"
              title={copied ? `Copied ${copyValue}` : copyValue}
              onClick={copyIdentifier}
            >
              <IconCopy className="icon-action-icon" />
            </button>
          )}
          {data.openFullCardHref && (
            <a
              href={data.openFullCardHref}
              aria-label={openFullCardLabel}
              className="icon-action"
            >
              <IconArrowTopRight className="icon-action-icon" />
            </a>
          )}
        </div>
        {copyValue && (
          <span
            className="copy-status"
            aria-live="polite"
            aria-atomic="true"
          >
            {copied ? 'URI copied!' : ''}
          </span>
        )}
      </div>

      {((data.properties?.length ?? 0) > 0 ||
        properties.length > 0) && (
        <dl className="properties">
          {[
            ...(data.properties ?? []),
            ...properties,
          ].map((property) => (
            <div
              key={property.label}
              className="property"
            >
              <dt className="property-label">
                {property.label}
              </dt>
              <dd className="property-value">
                {property.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

    </Popover>
  );
}

export { EntityPreviewCard };
