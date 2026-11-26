import { useState, type AriaAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { AttachedPopoverCard, type PopoverCardProps } from './AttachedPopoverCard';
import { focusFirstIn, hasModifierKey } from './popoverCardFocus';
import { usePopoverCardState } from './usePopoverCardState';
import { usePopoverTrigger, type PopoverCardOpening } from './usePopoverTrigger';

export type WrappingPopoverCardProps = PopoverCardProps & {
  trigger: (attributes: AriaAttributes) => ReactNode;
  opening?: PopoverCardOpening;
};

/**
 * Popovercard that creates and wraps its own trigger
 */
export function WrappingPopoverCard({
  trigger,
  opening = 'link',
  ...card
}: WrappingPopoverCardProps) {
  const [element, setElement] = useState<HTMLSpanElement | null>(null);
  const hasContent = Boolean(card.content) || Boolean(card.isPending);
  const state = usePopoverCardState(element, { hasContent });
  const triggerHandlers = usePopoverTrigger(opening, state);
  const { id, visible, popupElement } = state;
  const attributes: AriaAttributes = hasContent ? {
    'aria-haspopup': 'dialog',
    'aria-expanded': visible,
    'aria-controls': visible ? id : undefined,
  } : {};

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
      {...triggerHandlers}
      onKeyDown={handleKeyDown}
    >
      {trigger(attributes)}
      <AttachedPopoverCard
        {...card}
        state={state}
        closeOnFocusLeave={opening !== 'link'}
      />
    </span>
  );
}
