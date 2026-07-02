import { useBodyScrollLock } from '../../lib';
import { cn } from '../../lib';
import * as React from 'react';
import {
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
} from 'react-aria-components';

export type DocumentDetailOverlayProps = {
  className?: string;
  modalClassName?: string;
  dialogClassName?: string;
  contentClassName?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
} & Omit<
  AriaModalOverlayProps,
  'children' | 'className' | 'style'
>;

const DocumentDetailOverlay = React.forwardRef<
  HTMLDivElement,
  DocumentDetailOverlayProps
>(
  (
    {
      className,
      modalClassName,
      dialogClassName,
      contentClassName = 'gds-document-detail-dialog-placement',
      ariaLabel,
      children,
      isDismissable = false,
      isOpen,
      ...props
    },
    ref,
  ) => {
    useBodyScrollLock(Boolean(isOpen));

    return (
      <AriaModalOverlay
        ref={ref}
        isOpen={isOpen}
        isDismissable={isDismissable}
        className={cn('gds-document-detail-overlay', className)}
        {...props}
      >
        <AriaModal className={cn('gds-document-detail-modal', modalClassName)}>
          <AriaDialog
            aria-label={ariaLabel}
            className={cn(
              contentClassName,
              'gds-document-detail-dialog',
              dialogClassName,
            )}
          >
            {children}
          </AriaDialog>
        </AriaModal>
      </AriaModalOverlay>
    );
  },
);
DocumentDetailOverlay.displayName = 'DocumentDetailOverlay';

export { DocumentDetailOverlay };
export * from './DocumentDetailCssRecipes';
export * from './DocumentDetailCanvases';
export * from './DocumentDetailControls';
export * from './DocumentDetailEntityHighlightMenu';
export * from './DocumentDetailLayout';
export * from './DocumentDetailReferenceCard';
export * from './DocumentDetailSidebarSection';
export * from './DocumentDetailSurfaces';
