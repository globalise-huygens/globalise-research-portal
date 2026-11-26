import { useEffectEvent, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import { placePopoverCard, placePopoverCardBeside } from './PopoverCardPosition';

export type UsePopoverCardPositionOptions = {
  visible: boolean;
  anchor?: Element;
  trigger: RefObject<HTMLSpanElement | null>;
  popupElement: HTMLElement | null;
  parentElement?: HTMLElement | null;
  parentPosition?: CSSProperties;
  preferBeside?: boolean;
  onAnchorUnavailable: () => void;
};

export function usePopoverCardPosition({
  visible, anchor, trigger, popupElement, parentElement, parentPosition,
  preferBeside, onAnchorUnavailable,
}: UsePopoverCardPositionOptions) {
  const [position, setPosition] = useState<CSSProperties>({ visibility: 'hidden' });
  const dismiss = useEffectEvent(onAnchorUnavailable);

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
      const next = computePosition(target, popupElement, parentElement, preferBeside);
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
    // The portal can stay visible after scrolling clips its inline trigger.
    let visibilityObserver: IntersectionObserver | undefined;
    if (shouldTrackScroll) {
      window.addEventListener('scroll', scheduleUpdate, true);
      visibilityObserver = new IntersectionObserver(([entry]) => {
        if (entry && !entry.isIntersecting) {
          dismiss();
        }
      });
      visibilityObserver.observe(target);
    }
    return () => {
      observer.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      if (shouldTrackScroll) {
        window.removeEventListener('scroll', scheduleUpdate, true);
      }
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
    };
  }, [
    visible, popupElement, parentElement, parentPosition, anchor, trigger,
    preferBeside,
  ]);

  return position;
}

function computePosition(
  target: Element,
  popupElement: HTMLElement,
  parentElement?: HTMLElement | null,
  preferBeside = false,
): CSSProperties {
  const { width, height } = popupElement.getBoundingClientRect();
  const place = parentElement || preferBeside
    ? placePopoverCardBeside
    : placePopoverCard;
  const reference = parentElement ?? target;
  return place(
    reference.getBoundingClientRect(), width, height,
    window.innerWidth, window.innerHeight,
  );
}

function isSamePosition(a: CSSProperties, b: CSSProperties) {
  return a.left === b.left && a.top === b.top && a.visibility === b.visibility;
}
