import { cn } from '@/lib/utils';
import * as React from 'react';

export type EntityBadgeType =
  | 'ship'
  | 'person'
  | 'place'
  | 'commodity'
  | 'dimensions'
  | 'organisation'
  | 'date'
  | 'document'
  | 'ner'
  | 'lin';

export function entityBadgeVariants({
  className,
}: { className?: string } = {}) {
  return cn('gds-entity-badge', className);
}

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
  return (
    <span
      className={entityBadgeVariants({ className })}
      data-type={type ?? 'ship'}
      {...props}
    >
      {icon && <span className="gds-entity-badge__icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export { EntityBadge };
