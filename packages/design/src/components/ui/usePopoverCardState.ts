import { createContext, useContext, useEffect, useId, useRef, useState, type CSSProperties } from 'react';

export const HOVER_DELAY = 350;
const CLOSE_DELAY = 200;

export type PopoverCardState = {
  id: string;
  trigger: Element | null;
  parent?: PopoverCardParent;
  open: boolean;
  visible: boolean;
  hasContent: boolean;
  closeOnFocusLeave: boolean;
  popupElement: HTMLElement | null;
  setPopupElement: (element: HTMLElement | null) => void;
  setCardHovered: (hovered: boolean) => void;
  isActive: () => boolean;
  keepOpen: () => void;
  scheduleOpen: (delay: number) => void;
  scheduleClose: () => void;
  close: () => void;
};

export type PopoverCardParent = {
  element: HTMLElement | null;
  position?: CSSProperties;
  activeChild?: string;
  openChild: (id: string) => void;
  keepOpen: () => void;
};

export const PopoverCardContext = createContext<PopoverCardParent | undefined>(undefined);

export type PopoverCardStateOptions = {
  hasContent: boolean;
  closeOnFocusLeave?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function usePopoverCardState(
  trigger: Element | null,
  { hasContent, closeOnFocusLeave = false, onOpenChange }: PopoverCardStateOptions,
): PopoverCardState {
  const id = useId();
  const parent = useContext(PopoverCardContext);
  const [open, setOpen] = useState(false);
  const [popupElement, setPopupElement] = useState<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isCardHovered = useRef(false);
  const isActiveChild = !parent || parent.activeChild === id;
  const visible = open && hasContent && isActiveChild;

  useEffect(() => () => clearTimeout(timer.current), []);

  const cancelTimer = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };
  const close = () => {
    cancelTimer();
    isCardHovered.current = false;
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
  const scheduleOpen = (delay: number) => {
    cancelTimer();
    timer.current = setTimeout(keepOpen, delay);
  };
  const closeUnlessInUse = () => {
    timer.current = undefined;
    const focused = document.activeElement;
    const isInUse = isCardHovered.current
      || (trigger?.contains(focused) ?? false)
      || (popupElement?.contains(focused) ?? false);

    if (!isInUse) {
      close();
    }
  };
  const scheduleClose = () => {
    cancelTimer();
    timer.current = setTimeout(closeUnlessInUse, CLOSE_DELAY);
  };

  const setCardHovered = (hovered: boolean) => {
    isCardHovered.current = hovered;
  };
  const isActive = () => open || timer.current !== undefined;

  return {
    id,
    trigger,
    parent,
    open,
    visible,
    hasContent,
    closeOnFocusLeave,
    popupElement,
    setPopupElement,
    setCardHovered,
    isActive,
    keepOpen,
    scheduleOpen,
    scheduleClose,
    close,
  };
}
