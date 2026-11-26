import { useEffectEvent, useLayoutEffect, useState, type CSSProperties } from 'react';
import { placePopoverCard, placePopoverCardBeside } from './PopoverCardPosition';

export type PopoverCardPlacement = 'below' | 'beside';

export type UsePopoverCardPositionOptions = {
  visible: boolean;
  target: Element | null;
  popupElement: HTMLElement | null;
  parentElement?: HTMLElement | null;
  parentPosition?: CSSProperties;
  placement: PopoverCardPlacement;
  onTargetUnavailable: () => void;
};

export function usePopoverCardPosition({
  visible,
  target,
  popupElement,
  parentElement,
  parentPosition,
  placement,
  onTargetUnavailable,
}: UsePopoverCardPositionOptions) {
  const [position, setPosition] = useState<CSSProperties>({ visibility: 'hidden' });
  const dismiss = useEffectEvent(onTargetUnavailable);

  useLayoutEffect(() => {
    if (!visible || !target || !popupElement) {
      return;
    }
    let frame: number | undefined;
    const update = () => {
      if (!target.isConnected) {
        dismiss();
        return;
      }
      const next = calcPosition(target, popupElement, parentElement, placement);
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
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry && !entry.isIntersecting) {
        dismiss();
      }
    });
    visibilityObserver.observe(target);
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);
    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
    };
  }, [visible, target, popupElement, parentElement, parentPosition, placement]);

  return position;
}

function calcPosition(
  target: Element,
  popupElement: HTMLElement,
  parentElement: HTMLElement | null | undefined,
  placement: PopoverCardPlacement,
): CSSProperties {
  const { width, height } = popupElement.getBoundingClientRect();
  const place = parentElement || placement === 'beside'
    ? placePopoverCardBeside
    : placePopoverCard;
  const reference = parentElement ?? target;
  const rect = reference.getBoundingClientRect();
  return place(rect, width, height, window.innerWidth, window.innerHeight);
}

function isSamePosition(a: CSSProperties, b: CSSProperties) {
  return a.left === b.left && a.top === b.top && a.visibility === b.visibility;
}
