export const popoverCardClassName = 'popover-card';

export function isInsidePopoverCard(target: EventTarget | null) {
  return target instanceof Element
    && target.closest(`.${popoverCardClassName}`) !== null;
}
