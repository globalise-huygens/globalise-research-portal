import { IconEvents } from '../icons';
import { EntityIcon } from './EntityIcon';
import { cn } from '../../lib';
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
  const className = 'gds-entity-tag__icon-svg';

  switch (type) {
    case 'occurrence':
      return <IconEvents className={className} />;
    case 'rulership':
      return <EntityIcon type="organisation" className={className} />;
    case 'voyage':
      return <EntityIcon type="ship" className={className} />;
    case 'conversion':
      return <EntityIcon type="document" className={className} />;
    default:
      return <EntityIcon type={type} className={className} />;
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
