import { useBodyScrollLock } from '../../../../lib';
import { cn } from '../../../../lib';
import * as React from 'react';
import {
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
} from 'react-aria-components';

export type ManifestViewerOverlayProps = {
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

const ManifestViewerOverlay = React.forwardRef<
  HTMLDivElement,
  ManifestViewerOverlayProps
>(
  (
    {
      className,
      modalClassName,
      dialogClassName,
      contentClassName = 'manifest-viewer-placement',
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
        className={cn('manifest-viewer-overlay', className)}
        {...props}
      >
        <AriaModal className={cn('manifest-viewer-modal', modalClassName)}>
          <AriaDialog
            aria-label={ariaLabel}
            className={cn(
              contentClassName,
              'manifest-viewer-dialog',
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
ManifestViewerOverlay.displayName = 'ManifestViewerOverlay';

export { ManifestViewerOverlay };
