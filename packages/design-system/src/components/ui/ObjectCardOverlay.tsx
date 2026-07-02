import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
} from 'react-aria-components';

export type ObjectCardOverlayProps = {
  className?: string;
  modalClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
} & Omit<
  AriaModalOverlayProps,
  'children' | 'className' | 'style'
>;

const ObjectCardOverlay = React.forwardRef<
  HTMLDivElement,
  ObjectCardOverlayProps
>(
  (
    {
      className,
      modalClassName,
      contentClassName = 'slot-content-band',
      children,
      isDismissable = true,
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
        className={cn('gds-object-card-overlay', className)}
        {...props}
      >
        <AriaModal
          className={cn('gds-object-card-overlay__modal', modalClassName)}
        >
          <div className="gds-object-card-overlay__frame">
            <div className="gds-object-card-overlay__grid">
              <div
                className={cn(
                  'gds-object-card-overlay__content',
                  contentClassName,
                )}
              >
                {children}
              </div>
            </div>
          </div>
        </AriaModal>
      </AriaModalOverlay>
    );
  },
);
ObjectCardOverlay.displayName = 'ObjectCardOverlay';

export { ObjectCardOverlay };
