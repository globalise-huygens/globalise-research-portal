import {
  useEffect,
  useEffectEvent,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { isInsidePopoverCard, popoverCardClassName } from './isInsidePopoverCard';
import { getFocusTarget, isIgnoredKey, moveFocusFromPreview } from './popoverCardFocus';
import { usePopoverCardPosition, type PopoverCardPlacement } from './usePopoverCardPosition';
import { PopoverCardContext, type PopoverCardState } from './usePopoverCardState';
import './PopoverCard.css';

export type PopoverCardProps = {
  label: string;
  content?: ReactNode;
  isPending?: boolean;
  placement?: PopoverCardPlacement;
};

export type AttachedPopoverCardProps = PopoverCardProps & {
  state: PopoverCardState;
  closeOnFocusLeave?: boolean;
};

/**
 * Popovercard that is attached to and triggered by an existing element
 */
export function AttachedPopoverCard(
  {
    state,
    label,
    content,
    isPending = false,
    placement = 'below',
    closeOnFocusLeave = false,
  }: AttachedPopoverCardProps,
) {
  const {
    id,
    trigger,
    parent,
    visible,
    popupElement,
    setPopupElement,
    setCardHovered,
    close,
    keepOpen,
    scheduleClose,
  } = state;
  const position = usePopoverCardPosition({
    visible,
    target: trigger,
    popupElement,
    parentElement: parent?.element,
    parentPosition: parent?.position,
    placement,
    onTargetUnavailable: close,
  });

  const focusTrigger = () => {
    const target = trigger && getFocusTarget(trigger);
    target?.focus({ preventScroll: true });
  };

  const handleWindowKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (isIgnoredKey(event)) {
      return;
    }
    const target = event.target;
    const isTab = event.key === 'Tab' && target instanceof Element;
    const targetDialog = isTab ? target.closest('[role="dialog"]') : null;

    if (targetDialog?.id === id) {
      const focusTarget = trigger && getFocusTarget(trigger);
      if (popupElement && focusTarget) {
        moveFocusFromPreview(event, popupElement, focusTarget, close);
      }
      return;
    }
    if (parent || event.key !== 'Escape' || isInsidePopoverCard(target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (popupElement?.contains(document.activeElement)) {
      focusTrigger();
    }
    close();
  });
  useEffect(() => {
    if (!visible) {
      return;
    }
    window.addEventListener('keydown', handleWindowKeyDown, true);
    return () => window.removeEventListener('keydown', handleWindowKeyDown, true);
  }, [visible]);

  if (!visible) {
    return null;
  }

  const handlePointerEnter = () => {
    setCardHovered(true);
    keepOpen();
  };
  const handlePointerLeave = (event: PointerEvent) => {
    setCardHovered(false);
    if (event.pointerType !== 'touch') {
      scheduleClose();
    }
  };
  const handleBlur = (event: FocusEvent) => {
    const next = event.relatedTarget;
    const isFocusLeaving = next instanceof Node
      && !trigger?.contains(next)
      && !popupElement?.contains(next);
    if (closeOnFocusLeave && isFocusLeaving) {
      close();
    } else {
      scheduleClose();
    }
  };
  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (event.defaultPrevented || event.key !== 'Escape') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    focusTrigger();
    close();
  };

  const card = (
    <div
      ref={setPopupElement}
      className={`gds ${popoverCardClassName}`}
      style={{ ...position, position: 'fixed' }}
    >
      <div
        role="dialog"
        id={id}
        aria-label={label}
        aria-busy={isPending || undefined}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={keepOpen}
        onBlurCapture={handleBlur}
        onKeyDown={handleKeyDown}
      >
        <PopoverCardBody position={position} onKeepOpen={keepOpen}>
          {content}
        </PopoverCardBody>
      </div>
    </div>
  );
  return createPortal(card, parent?.element ?? document.body);
}

function PopoverCardBody({ children, position, onKeepOpen }: {
  children: ReactNode;
  position?: CSSProperties;
  onKeepOpen: () => void;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [activeChild, setActiveChild] = useState<string>();
  const parent = {
    element,
    position,
    activeChild,
    openChild: setActiveChild,
    keepOpen: onKeepOpen,
  };
  return (
    <div ref={setElement}>
      <PopoverCardContext.Provider value={parent}>
        {children}
      </PopoverCardContext.Provider>
    </div>
  );
}
