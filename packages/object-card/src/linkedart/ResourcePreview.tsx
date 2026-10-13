import { EntityPreviewCard, type EntityPreviewCardData, placeEntityPreview } from '@globalise/design';
import { createContext, useContext, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type AriaAttributes, type CSSProperties, type ReactNode } from 'react';
import { Popover } from 'react-aria-components';
import { createPortal } from 'react-dom';
import './ResourcePreview.css';
import { placeResourcePreviewBeside } from './ResourcePreviewPosition.ts';

const PreviewContext = createContext<{
  element: HTMLElement | null;
  activeChild?: string;
  openChild: (id: string) => void;
  keepOpen: () => void;
} | undefined>(undefined);

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const focusable = (container: Element) => Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
  .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);

export function ResourcePreview({ data, children }: {
  data?: EntityPreviewCardData;
  children: (attributes: AriaAttributes) => ReactNode;
}) {
  const id = useId();
  const parent = useContext(PreviewContext);
  const parentElement = parent?.element;
  const [activeChild, setActiveChild] = useState<string>();
  const trigger = useRef<HTMLSpanElement>(null);
  const popup = useRef<HTMLElement>(null);
  const [popupElement, setPopupElement] = useState<HTMLElement | null>(null);
  const popupRef = useCallback((element: HTMLElement | null) => {
    popup.current = element;
    setPopupElement(element);
  }, []);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({ visibility: 'hidden' });
  const visible = open && !!data && (!parent || parent.activeChild === id);
  const isRoot = !parent;
  const cancelTimer = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };
  const close = () => {
    cancelTimer();
    setOpen(false);
  };
  const keepOpen = () => {
    cancelTimer();
    parent?.keepOpen();
    parent?.openChild(id);
    setOpen(true);
  };
  const scheduleClose = () => {
    cancelTimer();
    timer.current = setTimeout(() => {
      timer.current = undefined;
      if (!trigger.current?.contains(document.activeElement) && !popup.current?.contains(document.activeElement)) {
        setOpen(false);
      }
    }, 200);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!visible || !isRoot) {return;}
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {return;}
      event.preventDefault();
      event.stopPropagation();
      if (popup.current?.contains(document.activeElement)) {
        trigger.current?.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true });
      }
      clearTimeout(timer.current);
      timer.current = undefined;
      setOpen(false);
    };
    document.addEventListener('keydown', dismissOnEscape, true);
    return () => document.removeEventListener('keydown', dismissOnEscape, true);
  }, [visible, isRoot]);
  useLayoutEffect(() => {
    if (!visible || !trigger.current || !popupElement) {return;}
    const anchor = trigger.current;
    const card = popupElement;
    const update = () => {
      const rect = card.getBoundingClientRect();
      setPosition(parentElement
        ? placeResourcePreviewBeside(parentElement.getBoundingClientRect(), rect.width, rect.height, window.innerWidth, window.innerHeight)
        : placeEntityPreview(anchor.getBoundingClientRect(), rect.width, rect.height, window.innerWidth, window.innerHeight));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    observer.observe(anchor);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [visible, popupElement, parentElement]);

  const card = (
    <div
      role="dialog"
      id={id}
      aria-label="Linked resource preview"
      onPointerEnter={keepOpen}
      onPointerLeave={scheduleClose}
      onFocusCapture={keepOpen}
      onBlurCapture={scheduleClose}
      onKeyDown={(event) => {
        if (event.defaultPrevented) {return;}
        if (event.key === 'Escape') {
          event.stopPropagation();
          trigger.current?.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true });
          close();
          return;
        }
        if (event.key !== 'Tab' || !popup.current || !trigger.current) {return;}
        const elements = focusable(popup.current);
        const anchor = trigger.current.querySelector<HTMLElement>('a[href]');
        if (!anchor) {return;}
        if (event.shiftKey && event.target === elements[0]) {
          event.preventDefault();
          anchor.focus({ preventScroll: true });
        } else if (!event.shiftKey && event.target === elements.at(-1)) {
          const outside = focusable(document.body).filter((element) => !popup.current?.contains(element));
          const next = outside[outside.indexOf(anchor) + 1];
          if (next) {
            event.preventDefault();
            next.focus({ preventScroll: true });
            close();
          }
        }
      }}
    >
      <PreviewContext.Provider value={{ element: popupElement, activeChild, openChild: setActiveChild, keepOpen }}>
        {data && <EntityPreviewCard data={data} />}
      </PreviewContext.Provider>
    </div>
  );

  return (
    <span
      ref={trigger}
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch') {return;}
        cancelTimer();
        timer.current = setTimeout(keepOpen, parent ? 0 : 350);
      }}
      onPointerLeave={scheduleClose}
      onFocusCapture={keepOpen}
      onBlurCapture={scheduleClose}
      onKeyDown={(event) => {
        if (event.defaultPrevented) {return;}
        if (event.key === 'Escape' && (open || timer.current !== undefined)) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
        if (event.key === 'Tab' && !event.shiftKey && visible && !popup.current?.contains(event.target as Node)) {
          const first = popup.current && focusable(popup.current)[0];
          if (first) {
            event.preventDefault();
            first.focus({ preventScroll: true });
          }
        }
      }}
    >
      {children(data ? { 'aria-haspopup': 'dialog', 'aria-expanded': visible, 'aria-controls': visible ? id : undefined } : {})}
      {parentElement ? visible && createPortal(
        <div ref={popupRef} className="gds resource-preview" style={{ ...position, position: 'fixed' }}>
          {card}
        </div>,
        parentElement,
      ) : (
        <Popover
          ref={popupRef}
          triggerRef={trigger}
          isOpen={visible}
          onOpenChange={(next) => { if (!next) {close();} }}
          isNonModal
          className="gds resource-preview"
          style={{ ...position, position: 'fixed' }}
        >
          {card}
        </Popover>
      )}
    </span>
  );
}
