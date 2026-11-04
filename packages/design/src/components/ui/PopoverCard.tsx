import { usePopoverCardPosition } from './usePopoverCardPosition';
import { getFocusableTreeWalker } from '@react-aria/focus';
import { createContext, useContext, useEffect, useEffectEvent, useId, useRef, useState, type AriaAttributes, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './PopoverCard.css';

const PopoverCardContext = createContext<{
  element: HTMLElement | null;
  position?: CSSProperties;
  activeChild?: string;
  openChild: (id: string) => void;
  keepOpen: () => void;
} | undefined>(undefined);

export function PopoverCard({ children, label, isPending = false, renderTrigger, anchor, isHovered, openImmediately = false, onOpenChange }: {
  children?: ReactNode;
  label: string;
  isPending?: boolean;
  renderTrigger?: (attributes: AriaAttributes) => ReactNode;
  anchor?: Element;
  isHovered?: boolean;
  openImmediately?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const id = useId();
  const parent = useContext(PopoverCardContext);
  const parentElement = parent?.element;
  const parentPosition = parent?.position;
  const trigger = useRef<HTMLSpanElement>(null);
  const touch = useRef(false);
  const previewHovered = useRef(false);
  const [popupElement, setPopupElement] = useState<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const hasPopupContent = Boolean(children) || isPending;
  const visible = open && hasPopupContent && (!parent || parent.activeChild === id);
  const isRoot = !parent;
  const cancelTimer = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };
  const close = () => {
    cancelTimer();
    previewHovered.current = false;
    setOpen(false);
    onOpenChange?.(false);
  };
  const keepOpen = () => {
    cancelTimer();
    parent?.keepOpen();
    parent?.openChild(id);
    setOpen(true);
    onOpenChange?.(true);
  };
  const scheduleClose = () => {
    cancelTimer();
    timer.current = setTimeout(() => {
      timer.current = undefined;
      const focusedElement = document.activeElement;
      const anchorHasFocus = focusedElement === anchor;
      const focusIsInsideTrigger = trigger.current?.contains(focusedElement) ?? false;
      const focusIsInsidePreview = popupElement?.contains(focusedElement) ?? false;
      const shouldKeepOpen = previewHovered.current || anchorHasFocus || focusIsInsideTrigger || focusIsInsidePreview;

      if (!shouldKeepOpen) {
        close();
      }
    }, 200);
  };
  const getTrigger = () => {
    const externalAnchor = anchor as HTMLElement | SVGElement | undefined;
    if (externalAnchor) {
      return externalAnchor;
    }
    return trigger.current ? getFocusableElements(trigger.current)[0] : undefined;
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  const updateHover = useEffectEvent(() => {
    if (isHovered) {
      cancelTimer();
      const hoverDelay = open || openImmediately ? 0 : 350;
      timer.current = setTimeout(keepOpen, hoverDelay);
    } else {
      scheduleClose();
    }
  });
  const dismiss = useEffectEvent(close);
  useEffect(() => {
    if (!anchor) {
      return;
    }
    updateHover();
    return () => clearTimeout(timer.current);
  }, [anchor, isHovered, openImmediately]);
  useEffect(() => {
    if (!anchor) {
      return;
    }
    const dismissOnMovement = (event: Event) => {
      const target = event.target;
      const isPointerDownOnAnchor = target instanceof Node
        && event.type === 'pointerdown' && anchor.contains(target);
      const isInsidePreview = target instanceof Node && popupElement?.contains(target);

      if (isPointerDownOnAnchor || isInsidePreview) {
        return;
      }
      dismiss();
    };
    window.addEventListener('wheel', dismissOnMovement, { capture: true, passive: true });
    window.addEventListener('scroll', dismissOnMovement, true);
    window.addEventListener('pointerdown', dismissOnMovement, true);
    return () => {
      window.removeEventListener('wheel', dismissOnMovement, true);
      window.removeEventListener('scroll', dismissOnMovement, true);
      window.removeEventListener('pointerdown', dismissOnMovement, true);
    };
  }, [anchor, popupElement]);
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const isModifiedTab = event.key === 'Tab' && (event.altKey || event.ctrlKey || event.metaKey);
    const shouldIgnoreKey = event.defaultPrevented || event.isComposing || isModifiedTab;

    if (shouldIgnoreKey) {
      return;
    }
    const target = event.target;
    const targetDialog = event.key === 'Tab' && target instanceof Element
      ? target.closest('[role="dialog"]') : null;
    const isTabInsidePreview = event.key === 'Tab' && targetDialog?.id === id;

    if (isTabInsidePreview) {
      const anchor = getTrigger();
      if (popupElement && anchor) {
        moveFocusFromPreview(event, popupElement, anchor, close);
      }
      return;
    }
    if (!isRoot) {
      return;
    }
    const isForwardTabFromAnchor = event.key === 'Tab' && anchor
      && !event.shiftKey && document.activeElement === anchor;

    if (isForwardTabFromAnchor) {
      const first = popupElement && getFocusableElements(popupElement)[0];
      if (first) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
      return;
    }
    const isInsidePreview = target instanceof Element && target.closest('.popover-card') !== null;
    const shouldDismissRoot = event.key === 'Escape' && !isInsidePreview;

    // Escape inside a preview is handled by that preview's own key handler.
    if (!shouldDismissRoot) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (popupElement?.contains(document.activeElement)) {
      getTrigger()?.focus({ preventScroll: true });
    }
    close();
  });
  useEffect(() => {
    // Escape must also cancel an external annotation's pending hover delay.
    if (!visible && !anchor) {
      return;
    }
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [visible, isRoot, anchor]);
  const position = usePopoverCardPosition({
    visible, anchor, trigger, popupElement, parentElement, parentPosition,
    onAnchorRemoved: close,
  });

  const card = (
    <div
      role="dialog"
      id={id}
      aria-label={label}
      aria-busy={isPending || undefined}
      onPointerEnter={() => {
        previewHovered.current = true;
        keepOpen();
      }}
      onPointerLeave={(event) => {
        previewHovered.current = false;
        if (event.pointerType !== 'touch') {
          scheduleClose();
        }
      }}
      onFocusCapture={keepOpen}
      onBlurCapture={scheduleClose}
      onKeyDown={(event) => {
        if (event.defaultPrevented) {
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          getTrigger()?.focus({ preventScroll: true });
          close();
          return;
        }
      }}
    >
      <PopoverCardBody position={position} onKeepOpen={keepOpen}>{children}</PopoverCardBody>
    </div>
  );

  const overlay = visible && createPortal(
    <div ref={setPopupElement} className="gds popover-card" style={{ ...position, position: 'fixed' }}>
      {card}
    </div>,
    parentElement ?? document.body,
  );

  if (!renderTrigger) {
    return overlay;
  }

  const triggerAttributes: AriaAttributes = hasPopupContent ? {
    'aria-haspopup': 'dialog',
    'aria-expanded': visible,
    'aria-controls': visible ? id : undefined,
  } : {};

  return (
    <span
      ref={trigger}
      onPointerDownCapture={(event) => {
        if (trigger.current?.contains(event.target as Node)) {
          touch.current = event.pointerType === 'touch';
        }
      }}
      onClickCapture={(event) => {
        const isKeyboardActivation = event.detail === 0;
        const isInsideTrigger = trigger.current?.contains(event.target as Node);
        const isPlainPrimaryClick = event.button === 0 && !hasModifierKey(event);
        const shouldOpenOnTouch = touch.current && !isKeyboardActivation
          && hasPopupContent && isInsideTrigger && isPlainPrimaryClick;

        if (!shouldOpenOnTouch) {
          return;
        }
        event.preventDefault();
        keepOpen();
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch') {
          return;
        }
        cancelTimer();
        timer.current = setTimeout(keepOpen, parent ? 0 : 350);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') {
          scheduleClose();
        }
      }}
      onFocusCapture={keepOpen}
      onBlurCapture={scheduleClose}
      onKeyDown={(event) => {
        if (event.defaultPrevented) {
          return;
        }
        if (event.key === 'Escape' && (open || timer.current !== undefined)) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
        const isPlainTab = event.key === 'Tab' && !hasModifierKey(event);
        const isFocusOutsidePopup = !popupElement?.contains(event.target as Node);
        if (isPlainTab && visible && isFocusOutsidePopup) {
          const first = popupElement && getFocusableElements(popupElement)[0];
          if (first) {
            event.preventDefault();
            first.focus({ preventScroll: true });
          }
        }
      }}
    >
      {renderTrigger(triggerAttributes)}
      {overlay}
    </span>
  );
}

function PopoverCardBody({ children, position, onKeepOpen }: {
  children: ReactNode;
  position?: CSSProperties;
  onKeepOpen: () => void;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [activeChild, setActiveChild] = useState<string>();
  return <div ref={setElement}>
    <PopoverCardContext.Provider value={{ element, position, activeChild, openChild: setActiveChild, keepOpen: onKeepOpen }}>
      {children}
    </PopoverCardContext.Provider>
  </div>;
}

function hasModifierKey(event: { shiftKey: boolean; altKey: boolean; ctrlKey: boolean; metaKey: boolean }) {
  return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
}

function getFocusableElements(container: Element) {
  const walker = getFocusableTreeWalker(container, { tabbable: true });
  const elements: (HTMLElement | SVGElement)[] = [];
  while (walker.nextNode()) {
    elements.push(walker.currentNode as HTMLElement | SVGElement);
  }
  return elements;
}

function moveFocusFromPreview(
  event: KeyboardEvent,
  popup: HTMLElement,
  anchor: HTMLElement | SVGElement,
  close: () => void,
) {
  if (event.key !== 'Tab') {
    return;
  }
  const elements = getFocusableElements(popup);
  if (event.shiftKey && event.target === elements[0]) {
    event.preventDefault();
    anchor.focus({ preventScroll: true });
  } else if (!event.shiftKey && event.target === elements.at(-1)) {
    const outside = getFocusableElements(document.body).filter((element) => !popup.contains(element));
    const anchorIndex = outside.indexOf(anchor);
    const next = anchorIndex >= 0 ? outside[anchorIndex + 1] : undefined;
    if (next) {
      event.preventDefault();
      next.focus({ preventScroll: true });
      close();
    }
  }
}
