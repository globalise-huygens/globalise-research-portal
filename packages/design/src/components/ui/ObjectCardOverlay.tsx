import { useBodyScrollLock } from '../../lib';
import { cn } from '../../lib';
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
        className={cn('object-card-overlay', className)}
        {...props}
      >
        <AriaModal
          className={cn('modal', modalClassName)}
        >
          <div className="frame">
            <div className="grid">
              <div
                className={cn(
                  'content',
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
