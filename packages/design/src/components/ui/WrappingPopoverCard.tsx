import {
  useRef,
  useState,
  type AriaAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { AttachedPopoverCard, type PopoverCardProps } from './AttachedPopoverCard';
import { focusFirstIn, hasModifierKey } from './popoverCardFocus';
import { HOVER_DELAY, usePopoverCardState } from './usePopoverCardState';

export type WrappingPopoverCardProps = PopoverCardProps & {
  trigger: (attributes: AriaAttributes) => ReactNode;
  openOnTouch?: boolean;
  openOnPress?: boolean;
  closeOnFocusLeave?: boolean;
};

/**
 * Popovercard that creates and wraps its own trigger
 */
export function WrappingPopoverCard({
  trigger,
  openOnTouch = true,
  openOnPress = false,
  closeOnFocusLeave = false,
  ...card
}: WrappingPopoverCardProps) {
  const [element, setElement] = useState<HTMLSpanElement | null>(null);
  const touch = useRef(false);
  const hasContent = Boolean(card.content) || Boolean(card.isPending);
  const state = usePopoverCardState(element, { hasContent, closeOnFocusLeave });
  const { id, visible, popupElement, keepOpen, scheduleClose } = state;
  const attributes: AriaAttributes = hasContent ? {
    'aria-haspopup': 'dialog',
    'aria-expanded': visible,
    'aria-controls': visible ? id : undefined,
  } : {};

  const isInsideTrigger = (target: EventTarget) =>
    element?.contains(target as Node) ?? false;

  const handlePointerDown = (event: PointerEvent) => {
    if (isInsideTrigger(event.target)) {
      touch.current = event.pointerType === 'touch';
    }
  };
  const handleClick = (event: MouseEvent) => {
    const isKeyboardActivation = event.detail === 0;
    const isPlainPrimaryClick = event.button === 0 && !hasModifierKey(event);
    if (!hasContent || !isInsideTrigger(event.target) || !isPlainPrimaryClick) {
      return;
    }
    const shouldOpenOnTouch = openOnTouch
      && touch.current
      && !isKeyboardActivation;

    if (shouldOpenOnTouch) {
      event.preventDefault();
      keepOpen();
    } else if (openOnPress) {
      keepOpen();
    }
  };
  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') {
      const delay = state.parent ? 0 : HOVER_DELAY;
      state.scheduleOpen(delay);
    }
  };
  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') {
      scheduleClose();
    }
  };
  const handleFocus = (event: FocusEvent) => {
    const isKeyboardFocus = event.target.matches(':focus-visible');
    if (openOnTouch || !touch.current || isKeyboardFocus) {
      keepOpen();
    }
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    const isPlainSpace = event.key === ' ' && !hasModifierKey(event);
    if (openOnPress && hasContent && isPlainSpace && isInsideTrigger(event.target)) {
      keepOpen();
    }
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    if (event.key === 'Escape' && state.isActive()) {
      event.preventDefault();
      event.stopPropagation();
      state.close();
    }
    const isPlainTab = event.key === 'Tab' && !hasModifierKey(event);
    const isFocusOutsidePopup = !popupElement?.contains(event.target as Node);
    if (isPlainTab && visible && isFocusOutsidePopup) {
      focusFirstIn(popupElement, event);
    }
  };

  return (
    <span
      ref={setElement}
      onPointerDownCapture={handlePointerDown}
      onClickCapture={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={scheduleClose}
      onKeyUpCapture={handleKeyUp}
      onKeyDown={handleKeyDown}
    >
      {trigger(attributes)}
      <AttachedPopoverCard {...card} state={state} />
    </span>
  );
}
