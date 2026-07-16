import { cn } from '../../../lib';
import * as React from 'react';
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components';

export type ViewerFloatingToolbarProps = {
  align?: 'start' | 'end';
} & React.HTMLAttributes<HTMLDivElement>;

function ViewerFloatingToolbar({
  align = 'start',
  className,
  ...props
}: ViewerFloatingToolbarProps) {
  return (
    <div
      className={cn('viewer-floating-toolbar', className)}
      data-align={align}
      {...props}
    />
  );
}

export type ViewerPopoverProps = {
  variant?: 'default' | 'warning' | 'accent';
  size?: 'compact' | 'default' | 'wide';
  icon?: React.ReactNode;
  heading?: React.ReactNode;
  titleId?: string;
  footer?: React.ReactNode;
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
>;

function ViewerPopover({
  className,
  variant = 'default',
  size = 'default',
  icon,
  heading,
  titleId,
  footer,
  children,
  ...props
}: ViewerPopoverProps) {
  return (
    <div
      className={cn('viewer-popover', className)}
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {(heading ?? icon) && (
        <div data-slot="header">
          {icon && <span data-slot="icon">{icon}</span>}
          {heading && (
            <h2
              id={titleId}
              data-slot="heading"
            >
              {heading}
            </h2>
          )}
        </div>
      )}
      <div data-slot="body">
        {children}
      </div>
      {footer && (
        <div data-slot="footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export type ViewerTooltipProps = {
  children: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  delay?: number;
  closeDelay?: number;
} & Omit<
  AriaTooltipProps,
  'children' | 'className'
>;

function ViewerTooltip({
  children,
  label,
  className,
  delay = 350,
  closeDelay = 80,
  placement = 'bottom',
  offset = 8,
  ...props
}: ViewerTooltipProps) {
  return (
    <AriaTooltipTrigger delay={delay} closeDelay={closeDelay}>
      {children}
      <AriaTooltip
        placement={placement}
        offset={offset}
        className={cn('viewer-tooltip', className)}
        {...props}
      >
        {label}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}

export type ViewerDockedToolbarProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerDockedToolbar({
  className,
  ...props
}: ViewerDockedToolbarProps) {
  return (
    <div className={cn('viewer-docked-toolbar', className)} {...props} />
  );
}

export {
  ViewerFloatingToolbar,
  ViewerPopover,
  ViewerDockedToolbar,
  ViewerTooltip,
};
