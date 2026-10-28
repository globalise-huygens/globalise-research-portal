import { EntityPreviewCard, type EntityPreviewCardData } from './EntityPreviewCard';
import { useEntityPreviewPosition } from './useEntityPreviewPosition';
import { createContext, useContext, useCallback, useEffect, useEffectEvent, useMemo, useId, useRef, useState, type AriaAttributes, type CSSProperties, type ReactNode } from 'react';
import { Popover } from 'react-aria-components';
import { createPortal } from 'react-dom';
import './EntityPreview.css';

const PreviewContext = createContext<{
  element: HTMLElement | null;
  position?: CSSProperties;
  activeChild?: string;
  openChild: (id: string) => void;
  keepOpen: () => void;
} | undefined>(undefined);

export function EntityPreview({ data, isPending = false, children, anchor, isHovered, openImmediately = false, onOpenChange }: {
  data?: EntityPreviewCardData;
  isPending?: boolean;
  children?: (attributes: AriaAttributes) => ReactNode;
  anchor?: Element;
  isHovered?: boolean;
  openImmediately?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const id = useId();
  const parent = useContext(PreviewContext);
  const parentElement = parent?.element;
  const parentPosition = parent?.position;
  const trigger = useRef<HTMLSpanElement>(null);
  const touch = useRef(false);
  const previewHovered = useRef(false);
  const externalTrigger = useMemo(() => ({ current: anchor ?? null }), [anchor]);
  const popup = useRef<HTMLElement>(null);
  const [popupElement, setPopupElement] = useState<HTMLElement | null>(null);
  const popupRef = useCallback((element: HTMLElement | null) => {
    popup.current = element;
    setPopupElement(element);
  }, []);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const visible = open && (!!data || isPending) && (!parent || parent.activeChild === id);
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
      if (!previewHovered.current && document.activeElement !== anchor
        && !trigger.current?.contains(document.activeElement) && !popup.current?.contains(document.activeElement)) {
        close();
      }
    }, 200);
  };
  const getTrigger = () => (anchor as HTMLElement | SVGElement | undefined)
    ?? trigger.current?.querySelector<HTMLElement>(focusableSelector);

  useEffect(() => () => clearTimeout(timer.current), []);
  const updateHover = useEffectEvent(() => {
    if (isHovered) {
      cancelTimer();
      timer.current = setTimeout(keepOpen, open || openImmediately ? 0 : 350);
    } else {
      scheduleClose();
    }
  });
  const dismiss = useEffectEvent(close);
  useEffect(() => {
    if (!anchor) {return;}
    updateHover();
    return () => clearTimeout(timer.current);
  }, [anchor, isHovered, openImmediately]);
  useEffect(() => {
    if (!anchor) {return;}
    const dismissOnMovement = (event: Event) => {
      if (event.target instanceof Node && (anchor.contains(event.target) && event.type === 'pointerdown'
        || popup.current?.contains(event.target))) {return;}
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
  }, [anchor]);
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing
      || event.key === 'Tab' && (event.altKey || event.ctrlKey || event.metaKey)) {return;}
    if (event.key === 'Tab' && event.target instanceof Element
      && event.target.closest('[role="dialog"]')?.id === id) {
      const anchor = getTrigger();
      if (popup.current && anchor) {
        moveFocusFromPreview(event, popup.current, anchor, close);
        // Handle portal boundaries before the popover's document-level focus restoration.
        if (event.defaultPrevented) {event.stopPropagation();}
      }
      return;
    }
    if (!isRoot) {return;}
    if (event.key === 'Tab' && anchor && !event.shiftKey && document.activeElement === anchor) {
      const first = popup.current && getFocusableElements(popup.current)[0];
      if (first) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
      return;
    }
    // Let the nearest preview handle Escape from inside the popup.
    if (event.key !== 'Escape' || popup.current?.contains(event.target as Node)) {return;}
    event.preventDefault();
    event.stopPropagation();
    if (popup.current?.contains(document.activeElement)) {
      getTrigger()?.focus({ preventScroll: true });
    }
    close();
  });
  useEffect(() => {
    if (!visible) {return;}
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [visible, isRoot, anchor]);
  const position = useEntityPreviewPosition({
    visible, anchor, trigger, popupElement, parentElement, parentPosition,
    onAnchorRemoved: close,
  });

  const card = (
    <div
      role="dialog"
      id={id}
      aria-label={typeof data?.title === 'string' ? `Preview: ${data.title}` : 'Linked resource preview'}
      aria-busy={isPending || undefined}
      onPointerEnter={() => {previewHovered.current = true; keepOpen();}}
      onPointerLeave={(event) => {
        previewHovered.current = false;
        if (event.pointerType !== 'touch') {scheduleClose();}
      }}
      onFocusCapture={keepOpen}
      onBlurCapture={scheduleClose}
      onKeyDown={(event) => {
        if (event.defaultPrevented) {return;}
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          getTrigger()?.focus({ preventScroll: true });
          close();
          return;
        }
      }}
    >
      <EntityPreviewBody data={data ?? { type: 'entity', title: 'Loading preview…' }} position={position} onKeepOpen={keepOpen} />
    </div>
  );

  const overlay = parentElement ? visible && createPortal(
    <div ref={popupRef} className="gds entity-preview" style={{ ...position, position: 'fixed' }}>
      {card}
    </div>,
    parentElement,
  ) : visible && (
    <Popover
      ref={popupRef}
      triggerRef={anchor ? externalTrigger : trigger}
      isOpen={visible}
      onOpenChange={(next) => { if (!next) {close();} }}
      isNonModal
      className="gds entity-preview"
      style={{ ...position, position: 'fixed' }}
    >
      {card}
    </Popover>
  );

  if (!children) {return overlay;}
  return (
    <span
      ref={trigger}
      onPointerDownCapture={(event) => {
        if (trigger.current?.contains(event.target as Node)) {
          touch.current = event.pointerType === 'touch';
        }
      }}
      onClickCapture={(event) => {
        if (!touch.current || event.detail === 0 || (!data && !isPending)
          || !trigger.current?.contains(event.target as Node)
          || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {return;}
        event.preventDefault();
        keepOpen();
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch') {return;}
        cancelTimer();
        timer.current = setTimeout(keepOpen, parent ? 0 : 350);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') {scheduleClose();}
      }}
      onFocusCapture={keepOpen}
      onBlurCapture={scheduleClose}
      onKeyDown={(event) => {
        if (event.defaultPrevented) {return;}
        if (event.key === 'Escape' && (open || timer.current !== undefined)) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
        if (event.key === 'Tab' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey && visible && !popup.current?.contains(event.target as Node)) {
          const first = popup.current && getFocusableElements(popup.current)[0];
          if (first) {
            event.preventDefault();
            first.focus({ preventScroll: true });
          }
        }
      }}
    >
      {children(data || isPending ? { 'aria-haspopup': 'dialog', 'aria-expanded': visible, 'aria-controls': visible ? id : undefined } : {})}
      {overlay}
    </span>
  );
}

export function EntityPreviewBody({ data, position, onKeepOpen }: {
  data: EntityPreviewCardData;
  position?: CSSProperties;
  onKeepOpen: () => void;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [activeChild, setActiveChild] = useState<string>();
  return <div ref={setElement}>
    <PreviewContext.Provider value={{ element, position, activeChild, openChild: setActiveChild, keepOpen: onKeepOpen }}>
      <EntityPreviewCard data={data} />
    </PreviewContext.Provider>
  </div>;
}

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function getFocusableElements(container: Element) {
  return Array.from(container.querySelectorAll<HTMLElement | SVGElement>(focusableSelector))
    .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
}

function moveFocusFromPreview(
  event: KeyboardEvent,
  popup: HTMLElement,
  anchor: HTMLElement | SVGElement,
  close: () => void,
) {
  if (event.key !== 'Tab') {return;}
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
