import {
  useRef,
  type DOMAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type SyntheticEvent,
} from 'react';
import { hasModifierKey } from './popoverCardFocus';
import { HOVER_DELAY, type PopoverCardState } from './usePopoverCardState';

export type PopoverCardOpening = 'link' | 'label' | 'action';

export type PopoverTriggerInput = {
  type: 'enter' | 'leave' | 'focus' | 'blur' | 'press';
  pointer: PopoverTriggerPointer;
};

export type PopoverTriggerPointer = 'mouse' | 'touch' | 'keyboard';

export type PopoverCardAction = {
  type: 'open' | 'open-delayed' | 'close-delayed' | 'none';
  preventDefault?: boolean;
};

type PointerActions = Record<PopoverTriggerPointer, PopoverCardAction>;

const none: PopoverCardAction = { type: 'none' };
const open: PopoverCardAction = { type: 'open' };
const openInstead: PopoverCardAction = { type: 'open', preventDefault: true };
const openDelayed: PopoverCardAction = { type: 'open-delayed' };
const closeDelayed: PopoverCardAction = { type: 'close-delayed' };

const pressActions: Record<PopoverCardOpening, PointerActions> = {
  link: { mouse: none, keyboard: none, touch: openInstead },
  label: { mouse: open, keyboard: open, touch: openInstead },
  action: { mouse: none, keyboard: none, touch: none },
};

const focusActions: Record<PopoverCardOpening, PointerActions> = {
  link: { mouse: open, keyboard: open, touch: open },
  label: { mouse: open, keyboard: open, touch: open },
  action: { mouse: open, keyboard: open, touch: none },
};

export function usePopoverTrigger(
  opening: PopoverCardOpening,
  state: PopoverCardState,
): DOMAttributes<HTMLSpanElement> {
  const lastPointer = useRef<PopoverTriggerPointer>('mouse');
  const { trigger, hasContent } = state;

  const handle = (event: SyntheticEvent, input?: PopoverTriggerInput) => {
    if (input) {
      const action = resolvePopoverAction(opening, input);
      applyPopoverAction(action, state, event);
    }
  };
  const isPressOnTrigger = (event: SyntheticEvent) =>
    hasContent && isInside(trigger, event.target);

  return {
    onPointerDownCapture: (event) => {
      if (isInside(trigger, event.target)) {
        lastPointer.current = toPointer(event);
      }
    },
    onPointerEnter: (event) => {
      handle(event, { type: 'enter', pointer: toPointer(event) });
    },
    onPointerLeave: (event) => {
      handle(event, { type: 'leave', pointer: toPointer(event) });
    },
    onFocusCapture: (event) => {
      const pointer = toFocusPointer(event, lastPointer.current);
      handle(event, { type: 'focus', pointer });
    },
    onBlurCapture: (event) => {
      handle(event, { type: 'blur', pointer: lastPointer.current });
    },
    onClickCapture: (event) => {
      if (isPressOnTrigger(event) && isPlainPrimaryClick(event)) {
        const pointer = toClickPointer(event, lastPointer.current);
        handle(event, { type: 'press', pointer });
      }
    },
    onKeyUpCapture: (event) => {
      if (isPressOnTrigger(event) && isPlainSpace(event)) {
        handle(event, { type: 'press', pointer: 'keyboard' });
      }
    },
  };
}

export function resolvePopoverAction(
  opening: PopoverCardOpening,
  { type, pointer }: PopoverTriggerInput,
): PopoverCardAction {
  const isTouch = pointer === 'touch';
  switch (type) {
    case 'enter':
      return isTouch ? none : openDelayed;
    case 'leave':
      return isTouch ? none : closeDelayed;
    case 'focus':
      return focusActions[opening][pointer];
    case 'blur':
      return closeDelayed;
    case 'press':
      return pressActions[opening][pointer];
  }
}

function applyPopoverAction(
  action: PopoverCardAction,
  state: PopoverCardState,
  event: SyntheticEvent,
) {
  if (action.preventDefault) {
    event.preventDefault();
  }
  switch (action.type) {
    case 'open':
      state.keepOpen();
      break;
    case 'open-delayed':
      state.scheduleOpen(state.parent ? 0 : HOVER_DELAY);
      break;
    case 'close-delayed':
      state.scheduleClose();
      break;
    case 'none':
      break;
  }
}

function toPointer(event: PointerEvent): PopoverTriggerPointer {
  return event.pointerType === 'touch' ? 'touch' : 'mouse';
}

function toFocusPointer(event: FocusEvent, lastPointer: PopoverTriggerPointer) {
  const isKeyboardFocus = event.target.matches(':focus-visible');
  return isKeyboardFocus ? 'keyboard' : lastPointer;
}

function toClickPointer(event: MouseEvent, lastPointer: PopoverTriggerPointer) {
  const isKeyboardActivation = event.detail === 0;
  return isKeyboardActivation ? 'keyboard' : lastPointer;
}

function isPlainPrimaryClick(event: MouseEvent) {
  return event.button === 0 && !hasModifierKey(event);
}

function isPlainSpace(event: KeyboardEvent) {
  return event.key === ' ' && !hasModifierKey(event);
}

function isInside(trigger: Element | null, target: EventTarget) {
  return trigger?.contains(target as Node) ?? false;
}
