import { IconArrowTopRight, IconClose, IconExternalLink } from '../icons';
import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  Group,
  Heading as AriaHeading,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  Separator as AriaSeparator,
} from 'react-aria-components';

export type ObjectCardProps = {
  className?: string;
} & Omit<
  AriaDialogProps,
  'className' | 'style'
>;

const ObjectCard = React.forwardRef<HTMLElement, ObjectCardProps>(
  ({ className, ...props }, ref) => (
    <AriaDialog
      ref={ref}
      className={cn('gds-object-card', className)}
      {...props}
    />
  ),
);
ObjectCard.displayName = 'ObjectCard';

export type ObjectCardTitleProps =
  {}
  & React.HTMLAttributes<HTMLHeadingElement>;

function ObjectCardTitle({ className, ...props }: ObjectCardTitleProps) {
  return (
    <AriaHeading
      slot="title"
      level={2}
      className={cn('gds-object-card__title', className)}
      {...props}
    />
  );
}

export type ObjectCardHeaderProps = {
  onClose?: () => void;
  className?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

type ObjectCardActionTooltipProps = {
  label?: React.ReactNode;
  children: React.ReactNode;
};

function ObjectCardActionTooltip({
  label,
  children,
}: ObjectCardActionTooltipProps) {
  if (!label) {
    return <>{children}</>;
  }

  return (
    <span className="gds-object-card__action-with-tooltip">
      {children}
      <span
        aria-hidden="true"
        className="gds-object-card__action-tooltip viewer-tooltip"
      >
        {label}
      </span>
    </span>
  );
}

function ObjectCardHeader({
  className,
  onClose,
  actions,
  children,
}: ObjectCardHeaderProps) {
  const hasActions = Boolean(actions ?? onClose);

  return (
    <header className={cn('gds-object-card__header', className)}>
      <div className="gds-object-card__header-main">{children}</div>
      {hasActions && (
        <div className="gds-object-card__header-actions">
          {actions}
          {onClose && (
            <ObjectCardActionTooltip label="Close">
              <AriaButton
                onPress={onClose}
                aria-label="Close"
                className="gds-object-card__close"
              >
                <IconClose className="gds-object-card__close-icon"/>
              </AriaButton>
            </ObjectCardActionTooltip>
          )}
        </div>
      )}
    </header>
  );
}

export type ObjectCardStatsProps = {
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardStats({ className, children }: ObjectCardStatsProps) {
  return (
    <div className={cn('gds-object-card__stats', className)}>{children}</div>
  );
}

export type ObjectCardStatProps = {
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardStat({ className, children }: ObjectCardStatProps) {
  return (
    <span className={cn('gds-object-card__stat', className)}>{children}</span>
  );
}

export type ObjectCardBodyProps = {
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardBody({ className, children }: ObjectCardBodyProps) {
  return (
    <div className={cn('gds-object-card__body', className)}>{children}</div>
  );
}

type ObjectCardPanelSide = 'left' | 'right';

function objectCardPanelVariants({ className }: { className?: string } = {}) {
  return cn('gds-object-card__panel', className);
}

export type ObjectCardPanelProps = {
  side?: ObjectCardPanelSide;
} & React.HTMLAttributes<HTMLDivElement>;

function ObjectCardPanel({ className, side, ...props }: ObjectCardPanelProps) {
  return (
    <div
      className={objectCardPanelVariants({ className })}
      data-side={side ?? 'left'}
      {...props}
    />
  );
}

export type ObjectCardSectionProps = {
  title?: string;
  scrollable?: boolean;
  sticky?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardSection({
  title,
  scrollable,
  sticky,
  className,
  children,
}: ObjectCardSectionProps) {
  const headingId = React.useId();
  return (
    <Group
      aria-labelledby={title ? headingId : undefined}
      className={cn('gds-object-card__section', className)}
      data-has-title={title ? 'true' : 'false'}
      data-sticky={sticky ? 'true' : undefined}
    >
      {title && (
        <AriaHeading
          level={3}
          id={headingId}
          className="gds-object-card__section-heading"
        >
          {title}
        </AriaHeading>
      )}
      {scrollable ? (
        <div className="gds-object-card__section-scroll">{children}</div>
      ) : (
        children
      )}
    </Group>
  );
}

export type ObjectCardPropertyProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

function ObjectCardProperty({
  label,
  value,
  className,
}: ObjectCardPropertyProps) {
  return (
    <div className={cn('gds-object-card__property', className)}>
      <dt className="gds-object-card__property-label">{label}</dt>
      <dd className="gds-object-card__property-value">{value}</dd>
    </div>
  );
}

export type ObjectCardPropertyListProps =
  React.HTMLAttributes<HTMLDListElement>;

function ObjectCardPropertyList({
  className,
  ...props
}: ObjectCardPropertyListProps) {
  return (
    <dl
      className={cn('gds-object-card__property-list', className)}
      {...props}
    />
  );
}

export type ObjectCardExternalLinkProps = {
  className?: string;
  children?: React.ReactNode;
} & Omit<
  AriaLinkProps,
  'className' | 'style' | 'children'
>;

const ObjectCardExternalLink = React.forwardRef<
  HTMLAnchorElement,
  ObjectCardExternalLinkProps
>(({ className, children, ...props }, ref) => {
  const content = (
    <>
      <span className="gds-object-card__external-link-label">{children}</span>
      <IconExternalLink className="gds-object-card__external-link-icon"/>
    </>
  );

  return (
    <AriaLink
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('gds-object-card__external-link', className)}
      {...props}
    >
      {content}
    </AriaLink>
  );
});
ObjectCardExternalLink.displayName = 'ObjectCardExternalLink';

export type ObjectCardListItemProps = {
  href?: string;
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardListItem({
  className,
  href,
  children,
}: ObjectCardListItemProps) {
  const classes = cn('gds-object-card__list-item', className);

  if (href) {
    return (
      <AriaLink href={href} className={classes}>
        <IconArrowTopRight className="gds-object-card__list-item-icon"/>
        {children}
      </AriaLink>
    );
  }

  return <div className={classes}>{children}</div>;
}

export type ObjectCardFooterProps = {
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardFooter({ className, children }: ObjectCardFooterProps) {
  return (
    <div className={cn('gds-object-card__footer', className)}>
      <AriaSeparator className="gds-object-card__footer-divider"/>
      <div className="gds-object-card__footer-content">{children}</div>
    </div>
  );
}

type ObjectCardActionVariant = 'default' | 'more';

function objectCardActionVariants({ className }: { className?: string } = {}) {
  return cn('gds-object-card__action', className);
}

export type ObjectCardActionProps = {
  className?: string;
  variant?: ObjectCardActionVariant;
  icon?: React.ReactNode;
  tooltipLabel?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'className' | 'style' | 'children'
>;

const ObjectCardAction = React.forwardRef<
  HTMLButtonElement,
  ObjectCardActionProps
>(({ className, variant, icon, children, tooltipLabel, ...props }, ref) => {
  const isIconOnly = !children;
  const resolvedTooltipLabel =
    tooltipLabel ?? (isIconOnly ? props['aria-label'] : undefined);

  const button = (
    <AriaButton
      ref={ref}
      className={objectCardActionVariants({ className })}
      data-icon-only={isIconOnly ? 'true' : 'false'}
      data-variant={variant ?? 'default'}
      {...props}
    >
      {icon && <span className="gds-object-card__action-icon">{icon}</span>}
      {children && <span>{children}</span>}
    </AriaButton>
  );

  return (
    <ObjectCardActionTooltip label={resolvedTooltipLabel}>
      {button}
    </ObjectCardActionTooltip>
  );
});
ObjectCardAction.displayName = 'ObjectCardAction';

export {
  ObjectCard,
  ObjectCardAction,
  objectCardActionVariants,
  ObjectCardBody,
  ObjectCardExternalLink,
  ObjectCardFooter,
  ObjectCardHeader,
  ObjectCardListItem,
  ObjectCardPanel,
  objectCardPanelVariants,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
  ObjectCardStat,
  ObjectCardStats,
  ObjectCardTitle,
};
