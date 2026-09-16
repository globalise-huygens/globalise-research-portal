import { IconArrowTopRight, IconCopy } from '../icons';
import { cn, useCopy } from '../../lib';
import * as React from 'react';
import { Popover } from './Popover';
import { Tooltip } from './Tooltip';
import { EntityBadge, type EntityBadgeType } from './EntityBadge';
import { getEntityTypeLabel, type EntityType } from './EntityIcon';

export type EntityPreviewCardAutomationBadge = 'ner' | 'lin';

export type EntityPreviewCardType = EntityType;

export type EntityPreviewCardData = {
  type: EntityPreviewCardType;
  title: React.ReactNode;
  properties?: EntityPreviewCardProperty[];
  badges?: EntityPreviewCardAutomationBadge[];
  icon?: React.ReactNode;
  openFullCardLabel?: string;
  openFullCardHref?: string;
  copyValue?: string;
};

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

function EntityPreviewCard({ data, className }: EntityPreviewCardProps) {
  const { copied, copy } = useCopy();
  const automationBadges = getAutomationBadges(data.badges);
  const openFullCardLabel = data.openFullCardLabel ?? 'Open full object card';
  const categoryLabel = getEntityTypeLabel(data.type);
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

      {(data.properties?.length ?? 0) > 0 && (
        <dl className="properties">
          {data.properties?.map((property) => (
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
