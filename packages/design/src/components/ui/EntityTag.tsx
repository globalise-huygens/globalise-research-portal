import { IconEntityDate } from '../icons';
import { IconEntityDimensions } from '../icons';
import { IconEntityDocument } from '../icons';
import { IconEntityOrganisation } from '../icons';
import { IconEntityPerson } from '../icons';
import { IconEntityPlace } from '../icons';
import { IconEntityShip } from '../icons';
import { cn } from '../../lib';
import * as React from 'react';
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';
import { IconEntityCommodity } from '../icons';

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
