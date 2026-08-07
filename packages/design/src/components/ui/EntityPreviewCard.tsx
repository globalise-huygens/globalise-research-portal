import { IconArrowTopRight, IconCopy, IconExternalLink } from '../icons';
import { cn } from '../../lib';
import * as React from 'react';
import { Popover } from './Popover';
import { EntityBadge, type EntityBadgeType } from './EntityBadge';

export type EntityPreviewCardAutomationBadge = 'ner' | 'lin';

export type EntityPreviewCardKind =
  | 'entity'
  | 'commodity'
  | 'concept'
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
  definition?: React.ReactNode;
  alternativeLabels?: React.ReactNode;
  properties?: EntityPreviewCardProperty[];
  badges?: EntityPreviewCardAutomationBadge[];
  icon?: React.ReactNode;
  externalLinks?: EntityPreviewCardExternalLink[];
  openFullCardLabel?: string;
  openFullCardHref?: string;
  /** URI or annotation identifier copied by the compact card action. */
  copyValue?: string;
  /** Whether the card represents a resolved authority/concept record. */
  linked?: boolean;
};

export type EntityPreviewCardEntityData = {
  kind: 'entity';
} & EntityPreviewCardBaseData;

export type EntityPreviewCardCommodityData = {
  kind: 'commodity';
  commodityType?: React.ReactNode;
  origin?: React.ReactNode;
  unit?: React.ReactNode;
  mentions?: React.ReactNode;
  qualifier?: React.ReactNode;
} & EntityPreviewCardBaseData;

export type EntityPreviewCardConceptData = {
  kind: 'concept';
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
  | EntityPreviewCardEntityData
  | EntityPreviewCardCommodityData
  | EntityPreviewCardConceptData
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

export type EntityPreviewCardExternalLink = {
  href: string;
  label: React.ReactNode;
};

function getEntityBadgeType(
  kind: EntityPreviewCardKind,
): EntityBadgeType | 'entity' {
  if (kind === 'concept') {
    return 'entity';
  }
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
    case 'entity':
      return 'Entity';
    case 'concept':
      return 'Concept';
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
  const summaryProperties: EntityPreviewCardProperty[] = [
    { label: 'Definition', value: data.definition },
    { label: 'Alt label', value: data.alternativeLabels },
  ].filter(
    (property): property is EntityPreviewCardProperty =>
      property.value !== undefined &&
      property.value !== null &&
      property.value !== '',
  );
  const automationBadges = getAutomationBadges(data.badges);
  const openFullCardLabel = data.openFullCardLabel ?? 'Open full object card';
  const categoryLabel = getEntityBadgeLabel(data.kind);

  return (
    <Popover
      size="compact"
      className={cn('entity-preview-card', className)}
      data-has-external-links={data.externalLinks?.length ? 'true' : 'false'}
      data-linked={data.linked ? 'true' : 'false'}
      data-kind={data.kind}
    >
      <div className="header">
        <div className="identity">
          <div className="leading">
            <span
              role="img"
              aria-label={`Category: ${categoryLabel}`}
              className="category"
              data-type={getEntityBadgeType(data.kind)}
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
          {data.copyValue && (
            <button
              type="button"
              aria-label="Copy identifier"
              className="action"
              onClick={() => {
                void navigator.clipboard?.writeText(data.copyValue ?? '');
              }}
            >
              <IconCopy />
            </button>
          )}
          {data.openFullCardHref && (
            <a
              href={data.openFullCardHref}
              aria-label={openFullCardLabel}
              className="action"
            >
              <IconArrowTopRight />
            </a>
          )}
          {!data.openFullCardHref && (
            <span
              aria-hidden="true"
              className="action"
              data-placeholder="true"
            >
              <IconArrowTopRight />
            </span>
          )}
        </div>
      </div>

      {(summaryProperties.length > 0 ||
        (data.properties?.length ?? 0) > 0 ||
        properties.length > 0) && (
        <dl className="properties">
          {[
            ...summaryProperties,
            ...(data.properties ?? []),
            ...properties,
          ].map((property) => (
            <div
              key={property.label}
              className="property"
            >
              <dt className="label">
                {property.label}
              </dt>
              <dd className="value">
                {property.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {!!data.externalLinks?.length && (
        <div className="external">
          <div className="label">
            External
          </div>
          <div className="external-links">
            {data.externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                <span>{link.label}</span>
                <IconExternalLink aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}
    </Popover>
  );
}

export { EntityPreviewCard };
