import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';
import { DocumentDetailToolbar } from './DocumentDetailSurfaces';

export type DocumentDetailTopBarProps = {} & React.HTMLAttributes<HTMLElement>;

function DocumentDetailTopBar({
  className,
  ...props
}: DocumentDetailTopBarProps) {
  return (
    <header
      className={cn(
        'document-full-bleed document-top-bar',
        className,
      )}
      {...props}
    />
  );
}

export type DocumentDetailBodyProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailBody({ className, ...props }: DocumentDetailBodyProps) {
  return (
    <div
      className={cn(
        'document-full-bleed document-body',
        className,
      )}
      {...props}
    />
  );
}

export type DocumentDetailIconRailProps = {} & React.HTMLAttributes<HTMLElement>;

function DocumentDetailIconRail({
  className,
  ...props
}: DocumentDetailIconRailProps) {
  return (
    <nav
      className={cn('document-icon-rail', className)}
      {...props}
    />
  );
}

export type DocumentDetailMetadataSidebarProps = {} & React.HTMLAttributes<HTMLElement>;

function DocumentDetailMetadataSidebar({
  className,
  ...props
}: DocumentDetailMetadataSidebarProps) {
  return (
    <nav className={cn('document-sidebar', className)} {...props} />
  );
}

export type DocumentDetailMetadataSidebarButtonProps = {
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

const DocumentDetailMetadataSidebarButton = React.forwardRef<
  HTMLButtonElement,
  DocumentDetailMetadataSidebarButtonProps
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
      className={cn('document-sidebar-button', className)}
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
DocumentDetailMetadataSidebarButton.displayName =
  'DocumentDetailMetadataSidebarButton';

export type DocumentDetailMetadataSidebarBadgeProps = {} & React.HTMLAttributes<HTMLSpanElement>;

function DocumentDetailMetadataSidebarBadge({
  className,
  ...props
}: DocumentDetailMetadataSidebarBadgeProps) {
  return (
    <span
      className={cn('document-sidebar-badge', className)}
      {...props}
    />
  );
}

export type DocumentDetailSidePanelProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailSidePanel({
  className,
  ...props
}: DocumentDetailSidePanelProps) {
  return (
    <div
      className={cn('document-side-panel', className)}
      {...props}
    />
  );
}

export type DocumentDetailViewerProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailViewer({
  className,
  ...props
}: DocumentDetailViewerProps) {
  return (
    <div className={cn('document-viewer', className)} {...props} />
  );
}

export type DocumentDetailSplitViewerProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailSplitViewer({
  className,
  ...props
}: DocumentDetailSplitViewerProps) {
  return (
    <div
      className={cn('document-split-viewer', className)}
      {...props}
    />
  );
}

export type DocumentDetailViewerPaneProps = {
  toolbar?: React.ReactNode;
  toolbarFloating?: boolean;
  toolbarClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailViewerPane({
  className,
  toolbar,
  toolbarFloating = false,
  toolbarClassName,
  children,
  ...props
}: DocumentDetailViewerPaneProps) {
  return (
    <div
      className={cn('document-viewer-pane', className)}
      data-toolbar-floating={toolbarFloating ? 'true' : undefined}
      {...props}
    >
      {toolbar && (
        <DocumentDetailToolbar className={toolbarClassName}>
          {toolbar}
        </DocumentDetailToolbar>
      )}
      <div data-slot="content">{children}</div>
    </div>
  );
}

export type DocumentDetailBarGroupProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailBarGroup({
  className,
  ...props
}: DocumentDetailBarGroupProps) {
  return (
    <div
      className={cn('document-bar-group', className)}
      {...props}
    />
  );
}

export type DocumentDetailTitleProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailTitle({
  className,
  ...props
}: DocumentDetailTitleProps) {
  return (
    <div className={cn('document-title', className)} {...props} />
  );
}

export type DocumentDetailPanelHeaderProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailPanelHeader({
  className,
  ...props
}: DocumentDetailPanelHeaderProps) {
  return (
    <div
      className={cn('document-panel-header', className)}
      {...props}
    />
  );
}

export type DocumentDetailBottomBarProps = {} & React.HTMLAttributes<HTMLElement>;

function DocumentDetailBottomBar({
  className,
  ...props
}: DocumentDetailBottomBarProps) {
  return (
    <footer
      className={cn(
        'document-full-bleed document-bottom-bar',
        className,
      )}
      {...props}
    />
  );
}

export {
  DocumentDetailBarGroup,
  DocumentDetailBody,
  DocumentDetailBottomBar,
  DocumentDetailIconRail,
  DocumentDetailMetadataSidebar,
  DocumentDetailMetadataSidebarBadge,
  DocumentDetailMetadataSidebarButton,
  DocumentDetailPanelHeader,
  DocumentDetailSidePanel,
  DocumentDetailSplitViewer,
  DocumentDetailTitle,
  DocumentDetailTopBar,
  DocumentDetailViewer,
  DocumentDetailViewerPane,
};
