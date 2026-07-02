import { IconEntityCommodity } from '@/components/icons/IconEntityCommodity';
import { IconEntityDate } from '@/components/icons/IconEntityDate';
import { IconEntityDimensions } from '@/components/icons/IconEntityDimensions';
import { IconEntityDocument } from '@/components/icons/IconEntityDocument';
import { IconEntityOrganisation } from '@/components/icons/IconEntityOrganisation';
import { IconEntityPerson } from '@/components/icons/IconEntityPerson';
import { IconEntityPlace } from '@/components/icons/IconEntityPlace';
import { IconEntityShip } from '@/components/icons/IconEntityShip';
import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';

export type EntityTagType =
  | 'ship'
  | 'person'
  | 'place'
  | 'commodity'
  | 'dimensions'
  | 'organisation'
  | 'date'
  | 'document';

export function entityTagVariants({ className }: { className?: string } = {}) {
  return cn('gds-entity-tag', className);
}

function getEntityTagIcon(type: EntityTagType) {
  const iconClassName = 'gds-entity-tag__icon-svg';

  switch (type) {
    case 'ship':
      return <IconEntityShip className={iconClassName} />;
    case 'person':
      return <IconEntityPerson className={iconClassName} />;
    case 'place':
      return <IconEntityPlace className={iconClassName} />;
    case 'commodity':
      return <IconEntityCommodity className={iconClassName} />;
    case 'dimensions':
      return <IconEntityDimensions className={iconClassName} />;
    case 'organisation':
      return <IconEntityOrganisation className={iconClassName} />;
    case 'date':
      return <IconEntityDate className={iconClassName} />;
    case 'document':
      return <IconEntityDocument className={iconClassName} />;
    default:
      return <IconEntityDocument className={iconClassName} />;
  }
}

export type EntityTagProps = {
  className?: string;
  type?: EntityTagType;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<
  AriaLinkProps,
  'className' | 'style' | 'children'
>;

function EntityTag({
  className,
  type = 'document',
  icon,
  children,
  href,
  ...props
}: EntityTagProps) {
  const content = (
    <>
      <span className="gds-entity-tag__label">{children}</span>
      <span className="gds-entity-tag__icon" aria-hidden="true">
        {icon ?? getEntityTagIcon(type)}
      </span>
    </>
  );

  if (href) {
    return (
      <AriaLink
        href={href}
        className={entityTagVariants({ className })}
        data-type={type}
        {...props}
      >
        {content}
      </AriaLink>
    );
  }

  return (
    <span className={entityTagVariants({ className })} data-type={type}>
      {content}
    </span>
  );
}

export { EntityTag };
