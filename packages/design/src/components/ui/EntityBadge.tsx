import * as React from 'react';
import { cn } from '../../lib';

export type EntityBadgeType =
  | 'ship'
  | 'person'
  | 'place'
  | 'commodity'
  | 'dimensions'
  | 'organisation'
  | 'polity'
  | 'rulership'
  | 'voyage'
  | 'conversion'
  | 'occurrence'
  | 'concept'
  | 'date'
  | 'document'
  | 'ner'
  | 'lin';

const colorByType: Partial<Record<EntityBadgeType, EntityBadgeType>> = {
  polity: 'organisation',
  rulership: 'organisation',
  voyage: 'ship',
  conversion: 'document',
  occurrence: 'document',
  concept: 'document',
};

export type EntityBadgeProps = {
  type?: EntityBadgeType;
  icon?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function EntityBadge({
  className,
  type,
  icon,
  children,
  ...props
}: EntityBadgeProps) {
  const badgeType = type ?? 'ship';
  return (
    <span
      className={cn('gds-entity-badge', className)}
      data-type={colorByType[badgeType] ?? badgeType}
      {...props}
    >
      {icon && <span className="gds-entity-badge__icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export { EntityBadge };
