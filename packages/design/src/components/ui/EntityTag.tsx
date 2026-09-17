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
  | 'date'
  | 'document';

export function entityTagVariants({ className }: { className?: string } = {}) {
  return cn('gds-entity-tag', className);
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
        {icon ?? <EntityIcon type={type} className="gds-entity-tag__icon-svg" />}
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
