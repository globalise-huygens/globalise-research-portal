import { IconArrowTopRight } from '@/components/icons/IconArrowTopRight';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { DocumentDetailPopoverSurface } from './DocumentDetailSurfaces';
import { EntityBadge, type EntityBadgeType } from './EntityBadge';

export type EntityPreviewCardAutomationBadge = 'ner' | 'lin';

export type EntityPreviewCardKind =
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
  badges?: EntityPreviewCardAutomationBadge[];
  icon?: React.ReactNode;
  openFullCardLabel?: string;
  openFullCardHref?: string;
};

export type EntityPreviewCardCommodityData = {
  kind: 'commodity';
  commodityType?: React.ReactNode;
  origin?: React.ReactNode;
  unit?: React.ReactNode;
  mentions?: React.ReactNode;
  qualifier?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardDateData = {
  kind: 'date';
  normalizedDate?: React.ReactNode;
  calendar?: React.ReactNode;
  period?: React.ReactNode;
  relatedEvent?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardDimensionsData = {
  kind: 'dimensions';
  measurementType?: React.ReactNode;
  value?: React.ReactNode;
  unit?: React.ReactNode;
  context?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardDocumentData = {
  kind: 'document';
  documentType?: React.ReactNode;
  reference?: React.ReactNode;
  archiveScan?: React.ReactNode;
  collection?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardOrganisationData = {
  kind: 'organisation';
  organisationType?: React.ReactNode;
  jurisdiction?: React.ReactNode;
  founded?: React.ReactNode;
  region?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardPersonData = {
  kind: 'person';
  role?: React.ReactNode;
  affiliation?: React.ReactNode;
  civicStatus?: React.ReactNode;
  activePeriod?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardPlaceData = {
  kind: 'place';
  placeType?: React.ReactNode;
  historicalForm?: React.ReactNode;
  region?: React.ReactNode;
  authority?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardPolityData = {
  kind: 'polity';
  polityType?: React.ReactNode;
  region?: React.ReactNode;
  period?: React.ReactNode;
  authority?: React.ReactNode;
  mentions?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardQuantityData = {
  kind: 'quantity';
  quantityType?: React.ReactNode;
  amount?: React.ReactNode;
  unit?: React.ReactNode;
  context?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardShipData = {
  kind: 'ship';
  shipType?: React.ReactNode;
  built?: React.ReactNode;
  laidUp?: React.ReactNode;
  tonnage?: React.ReactNode;
  voyages?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardData =
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

type EntityPreviewCardProperty = {
  label: string;
  value: React.ReactNode;
};

function getEntityBadgeType(kind: EntityPreviewCardKind): EntityBadgeType {
  if (kind === 'polity') {
    return 'organisation';
  }

  if (kind === 'quantity') {
    return 'dimensions';
  }

  return kind;
}

function getEntityBadgeLabel(kind: EntityPreviewCardKind) {
  switch (kind) {
    case 'organisation':
      return 'Organisation';
    case 'dimensions':
      return 'Measure';
    default:
      return kind;
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
  switch (data.kind) {
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

  return (
    <DocumentDetailPopoverSurface
      size="compact"
      className={cn('gds-entity-preview-card', className)}
    >
      <div className="gds-entity-preview-card__header">
        <div className="gds-entity-preview-card__identity">
          <div className="gds-entity-preview-card__leading-row">
            <EntityBadge
              type={getEntityBadgeType(data.kind)}
              icon={data.icon}
              className="gds-entity-preview-card__entity-badge"
            >
              {getEntityBadgeLabel(data.kind)}
            </EntityBadge>
            {automationBadges.map((badge) => (
              <EntityBadge
                key={badge}
                type={badge}
                className="gds-entity-preview-card__automation-badge"
              >
                {badge.toUpperCase()}
              </EntityBadge>
            ))}
          </div>
          <div className="gds-entity-preview-card__title">{data.title}</div>
        </div>

        <a
          href={data.openFullCardHref ?? '#'}
          aria-label={openFullCardLabel}
          aria-disabled={data.openFullCardHref ? undefined : 'true'}
          tabIndex={data.openFullCardHref ? undefined : -1}
          onClick={(event) => {
            if (!data.openFullCardHref) {
              event.preventDefault();
            }
          }}
          className={cn(
            'gds-entity-preview-card__icon-action',
            !data.openFullCardHref &&
              'gds-entity-preview-card__icon-action--disabled',
          )}
        >
          <IconArrowTopRight className="gds-entity-preview-card__icon-action-icon" />
        </a>
      </div>

      {properties.length > 0 && (
        <dl className="gds-entity-preview-card__properties">
          {properties.map((property) => (
            <div
              key={property.label}
              className="gds-entity-preview-card__property"
            >
              <dt className="gds-entity-preview-card__property-label">
                {property.label}
              </dt>
              <dd className="gds-entity-preview-card__property-value">
                {property.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </DocumentDetailPopoverSurface>
  );
}

export { EntityPreviewCard };
