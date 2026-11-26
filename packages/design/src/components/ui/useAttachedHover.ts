import { useEffect, useEffectEvent } from 'react';
import { focusFirstIn, isIgnoredKey } from './popoverCardFocus';
import { HOVER_DELAY, type PopoverCardState } from './usePopoverCardState';

export type AttachedHover = {
  isHovered: boolean;
  openImmediately?: boolean;
};

export function useAttachedHover(
  state: PopoverCardState,
  { isHovered, openImmediately = false }: AttachedHover,
) {
  const { trigger, popupElement } = state;

  const updateHover = useEffectEvent(() => {
    if (isHovered) {
      const isImmediate = state.open || openImmediately;
      state.scheduleOpen(isImmediate ? 0 : HOVER_DELAY);
    } else {
      state.scheduleClose();
    }
  });
  useEffect(() => updateHover(), [trigger, isHovered, openImmediately]);

  const dismiss = useEffectEvent(state.close);
  useEffect(() => {
    if (!trigger) {
      return;
    }
    const dismissOnMovement = (event: Event) => {
      const target = event.target;
      const isPointerDownOnTrigger = target instanceof Node
        && event.type === 'pointerdown' && trigger.contains(target);
      const isInsidePreview = target instanceof Node && popupElement?.contains(target);

      if (!isPointerDownOnTrigger && !isInsidePreview) {
        dismiss();
      }
    };
    window.addEventListener('wheel', dismissOnMovement, { capture: true, passive: true });
    window.addEventListener('scroll', dismissOnMovement, true);
    window.addEventListener('pointerdown', dismissOnMovement, true);
    return () => {
      window.removeEventListener('wheel', dismissOnMovement, true);
      window.removeEventListener('scroll', dismissOnMovement, true);
      window.removeEventListener('pointerdown', dismissOnMovement, true);
    };
  }, [trigger, popupElement]);

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (isIgnoredKey(event)) {
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && document.activeElement === trigger) {
      focusFirstIn(popupElement, event);
    } else if (event.key === 'Escape' && !state.visible) {
      event.preventDefault();
      event.stopPropagation();
      state.close();
    }
  });
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);
}
