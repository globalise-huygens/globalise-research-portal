import { useEffectEvent, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import { placePopoverCard, placePopoverCardBeside } from './PopoverCardPosition';

export type UsePopoverCardPositionOptions = {
  visible: boolean;
  anchor?: Element;
  trigger: RefObject<HTMLSpanElement | null>;
  popupElement: HTMLElement | null;
  parentElement?: HTMLElement | null;
  parentPosition?: CSSProperties;
  onAnchorRemoved: () => void;
};

export function usePopoverCardPosition({
  visible, anchor, trigger, popupElement, parentElement, parentPosition, onAnchorRemoved,
}: UsePopoverCardPositionOptions) {
  const [position, setPosition] = useState<CSSProperties>({ visibility: 'hidden' });
  const dismiss = useEffectEvent(onAnchorRemoved);

  useLayoutEffect(() => {
    const target = anchor ?? trigger.current;
    if (!visible || !target || !popupElement) {
      return;
    }
    const shouldTrackScroll = !anchor;
    let frame: number | undefined;
    const update = () => {
      if (!target.isConnected) {
        dismiss();
        return;
      }
      const next = computePosition(target, popupElement, parentElement);
      setPosition((current) => isSamePosition(current, next) ? current : next);
    };
    const scheduleUpdate = () => {
      frame ??= requestAnimationFrame(() => {
        frame = undefined;
        update();
      });
    };
    update();
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(popupElement);
    observer.observe(target);
    window.addEventListener('resize', scheduleUpdate);
    if (shouldTrackScroll) {
      window.addEventListener('scroll', scheduleUpdate, true);
    }
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      if (shouldTrackScroll) {
        window.removeEventListener('scroll', scheduleUpdate, true);
      }
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
    };
  }, [visible, popupElement, parentElement, parentPosition, anchor, trigger]);

  return position;
}

function computePosition(target: Element, popupElement: HTMLElement, parentElement?: HTMLElement | null): CSSProperties {
  const { width, height } = popupElement.getBoundingClientRect();
  const place = parentElement ? placePopoverCardBeside : placePopoverCard;
  const reference = parentElement ?? target;
  return place(reference.getBoundingClientRect(), width, height, window.innerWidth, window.innerHeight);
}

function isSamePosition(a: CSSProperties, b: CSSProperties) {
  return a.left === b.left && a.top === b.top && a.visibility === b.visibility;
}
