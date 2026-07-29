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

export type ObjectCardProps = React.HTMLAttributes<HTMLElement>;

const ObjectCard = React.forwardRef<HTMLElement, ObjectCardProps>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('object-card', className)}
      {...props}
    />
  ),
);
ObjectCard.displayName = 'ObjectCard';

export type DialogObjectCardProps = {
  className?: string;
} & Omit<
  AriaDialogProps,
  'className' | 'style'
>;

const ObjectCardDialog = React.forwardRef<HTMLElement, DialogObjectCardProps>(
  ({ className, ...props }, ref) => (
    <AriaDialog
      ref={ref}
      className={cn('object-card', className)}
      {...props}
    />
  ),
);
ObjectCardDialog.displayName = 'DialogObjectCard';

export type ObjectCardTitleProps =
  {}
  & React.HTMLAttributes<HTMLHeadingElement>;

function ObjectCardTitle({ className, ...props }: ObjectCardTitleProps) {
  return (
    <AriaHeading
      slot="title"
      level={2}
      className={cn('title', className)}
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
    <span className="action-with-tooltip">
      {children}
      <span
        aria-hidden="true"
        className="action-tooltip tooltip"
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
    <header className={cn('header', className)}>
      <div className="header-main">{children}</div>
      {hasActions && (
        <div className="header-actions">
          {actions}
          {onClose && (
            <ObjectCardActionTooltip label="Close">
              <AriaButton
                onPress={onClose}
                aria-label="Close"
                className="close"
              >
                <IconClose className="close-icon"/>
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
    <div className={cn('stats', className)}>{children}</div>
  );
}

export type ObjectCardStatProps = {
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardStat({ className, children }: ObjectCardStatProps) {
  return (
    <span className={cn('stat', className)}>{children}</span>
  );
}

export type ObjectCardBodyProps = {
  className?: string;
  children?: React.ReactNode;
};

function ObjectCardBody({ className, children }: ObjectCardBodyProps) {
  return (
    <div className={cn('body', className)}>{children}</div>
  );
}

type ObjectCardPanelSide = 'left' | 'right';

function objectCardPanelVariants({ className }: { className?: string } = {}) {
  return cn('panel', className);
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
      className={cn('section', className)}
      data-has-title={title ? 'true' : 'false'}
      data-sticky={sticky ? 'true' : undefined}
    >
      {title && (
        <AriaHeading
          level={3}
          id={headingId}
          className="section-heading"
        >
          {title}
        </AriaHeading>
      )}
      {scrollable ? (
        <div className="section-scroll">{children}</div>
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
    <div className={cn('property', className)}>
      <dt className="property-label">{label}</dt>
      <dd className="property-value">{value}</dd>
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
      className={cn('property-list', className)}
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
      <span className="external-link-label">{children}</span>
      <IconExternalLink className="external-link-icon"/>
    </>
  );

  return (
    <AriaLink
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('external-link', className)}
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
  const classes = cn('list-item', className);

  if (href) {
    return (
      <AriaLink href={href} className={classes}>
        <IconArrowTopRight className="list-item-icon"/>
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
    <div className={cn('footer', className)}>
      <AriaSeparator className="footer-divider"/>
      <div className="footer-content">{children}</div>
    </div>
  );
}

type ObjectCardActionVariant = 'default' | 'more';

function objectCardActionVariants({ className }: { className?: string } = {}) {
  return cn('action', className);
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
      {icon && <span className="action-icon">{icon}</span>}
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
  ObjectCardDialog,
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
