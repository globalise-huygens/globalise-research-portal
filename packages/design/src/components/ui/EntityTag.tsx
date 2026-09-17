import { IconEntityDate } from '../icons';
import { IconEntityDimensions } from '../icons';
import { IconEntityDocument } from '../icons';
import { IconEntityOrganisation } from '../icons';
import { IconEntityPerson } from '../icons';
import { IconEntityPlace } from '../icons';
import { IconEntityShip } from '../icons';
import { IconConcept } from '../icons';
import { IconEvents } from '../icons';
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
  | 'polity'
  | 'rulership'
  | 'voyage'
  | 'conversion'
  | 'occurrence'
  | 'concept'
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
    case 'polity':
    case 'rulership':
      return <IconEntityOrganisation className={iconClassName} />;
    case 'voyage':
      return <IconEntityShip className={iconClassName} />;
    case 'concept':
      return <IconConcept className={iconClassName} />;
    case 'occurrence':
      return <IconEvents className={iconClassName} />;
    case 'conversion':
      return <IconEntityDocument className={iconClassName} />;
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
  onPress,
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

  if (href || onPress) {
    return (
      <AriaLink
        href={href}
        onPress={onPress}
        className={entityTagVariants({ className })}
        data-type={type}
        data-interactive="true"
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
