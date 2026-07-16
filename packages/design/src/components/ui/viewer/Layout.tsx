import { cn } from '../../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';
import { ViewerDockedToolbar } from './Surfaces';

export type ViewerTopBarProps = {} & React.HTMLAttributes<HTMLElement>;

function ViewerTopBar({
  className,
  ...props
}: ViewerTopBarProps) {
  return (
    <header
      className={cn(
        'viewer-full-bleed viewer-top-bar',
        className,
      )}
      {...props}
    />
  );
}

export type ViewerBodyProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerBody({ className, ...props }: ViewerBodyProps) {
  return (
    <div
      className={cn(
        'viewer-full-bleed viewer-body',
        className,
      )}
      {...props}
    />
  );
}

export type ViewerIconRailProps = {} & React.HTMLAttributes<HTMLElement>;

function ViewerIconRail({
  className,
  ...props
}: ViewerIconRailProps) {
  return (
    <nav
      className={cn('viewer-icon-rail', className)}
      {...props}
    />
  );
}

export type ViewerMetadataSidebarProps = {} & React.HTMLAttributes<HTMLElement>;

function ViewerMetadataSidebar({
  className,
  ...props
}: ViewerMetadataSidebarProps) {
  return (
    <nav className={cn('viewer-sidebar', className)} {...props} />
  );
}

export type ViewerMetadataSidebarButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  count?: React.ReactNode;
  trailing?: React.ReactNode;
  variant?: 'default' | 'warning';
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const ViewerMetadataSidebarButton = React.forwardRef<
  HTMLButtonElement,
  ViewerMetadataSidebarButtonProps
>(
  (
    {
      className,
      icon,
      label,
      count,
      trailing,
      variant = 'default',
      children,
      ...props
    },
    ref,
  ) => (
    <AriaButton
      ref={ref}
      className={cn('viewer-sidebar-button', className)}
      data-variant={variant}
      {...props}
    >
      <span data-slot="content">
        {icon && <span data-slot="icon">{icon}</span>}
        {label && (
          <span data-slot="label">
            {label}
          </span>
        )}
        {count && (
          <span data-slot="count">
            {count}
          </span>
        )}
        {children}
      </span>
      {trailing && <span data-slot="icon">{trailing}</span>}
    </AriaButton>
  ),
);
ViewerMetadataSidebarButton.displayName =
  'ViewerMetadataSidebarButton';

export type ViewerMetadataSidebarBadgeProps = {} & React.HTMLAttributes<HTMLSpanElement>;

function ViewerMetadataSidebarBadge({
  className,
  ...props
}: ViewerMetadataSidebarBadgeProps) {
  return (
    <span
      className={cn('viewer-sidebar-badge', className)}
      {...props}
    />
  );
}

export type ViewerSidePanelProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerSidePanel({
  className,
  ...props
}: ViewerSidePanelProps) {
  return (
    <div
      className={cn('viewer-side-panel', className)}
      {...props}
    />
  );
}

export type ViewerAreaProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerArea({
  className,
  ...props
}: ViewerAreaProps) {
  return (
    <div className={cn('viewer-area', className)} {...props} />
  );
}

export type SplitViewerProps = {} & React.HTMLAttributes<HTMLDivElement>;

function SplitViewer({
  className,
  ...props
}: SplitViewerProps) {
  return (
    <div
      className={cn('split-viewer', className)}
      {...props}
    />
  );
}

export type ViewerPaneProps = {
  toolbar?: React.ReactNode;
  toolbarFloating?: boolean;
  toolbarClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function ViewerPane({
  className,
  toolbar,
  toolbarFloating = false,
  toolbarClassName,
  children,
  ...props
}: ViewerPaneProps) {
  return (
    <div
      className={cn('viewer-pane', className)}
      data-toolbar-floating={toolbarFloating ? 'true' : undefined}
      {...props}
    >
      {toolbar && (
        <ViewerDockedToolbar className={toolbarClassName}>
          {toolbar}
        </ViewerDockedToolbar>
      )}
      <div data-slot="content">{children}</div>
    </div>
  );
}

export type ViewerBarGroupProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerBarGroup({
  className,
  ...props
}: ViewerBarGroupProps) {
  return (
    <div
      className={cn('viewer-bar-group', className)}
      {...props}
    />
  );
}

export type ViewerTitleProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerTitle({
  className,
  ...props
}: ViewerTitleProps) {
  return (
    <div className={cn('viewer-title', className)} {...props} />
  );
}

export type ViewerPanelHeaderProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerPanelHeader({
  className,
  ...props
}: ViewerPanelHeaderProps) {
  return (
    <div
      className={cn('viewer-panel-header', className)}
      {...props}
    />
  );
}

export type ViewerBottomBarProps = {} & React.HTMLAttributes<HTMLElement>;

function ViewerBottomBar({
  className,
  ...props
}: ViewerBottomBarProps) {
  return (
    <footer
      className={cn(
        'viewer-full-bleed viewer-bottom-bar',
        className,
      )}
      {...props}
    />
  );
}

export {
  ViewerBarGroup,
  ViewerBody,
  ViewerBottomBar,
  ViewerIconRail,
  ViewerMetadataSidebar,
  ViewerMetadataSidebarBadge,
  ViewerMetadataSidebarButton,
  ViewerPanelHeader,
  ViewerSidePanel,
  SplitViewer,
  ViewerTitle,
  ViewerTopBar,
  ViewerArea,
  ViewerPane,
};
