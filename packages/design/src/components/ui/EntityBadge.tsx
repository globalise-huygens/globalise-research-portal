import * as React from 'react';
import { cn } from '../../lib';
import { getPresentationFamily } from '@globalise/common';

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
      className={cn('entity-badge', className)}
      data-type={badgeType}
      data-presentation-family={getPresentationFamily(badgeType)}
      {...props}
    >
      {icon && <span className="icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export { EntityBadge };
