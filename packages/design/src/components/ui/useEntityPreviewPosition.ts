import { useEffectEvent, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import { placeEntityPreview, placeEntityPreviewBeside } from './EntityPreviewPosition';

export function useEntityPreviewPosition({
  visible, anchor, trigger, popupElement, parentElement, parentPosition, onAnchorRemoved,
}: {
  visible: boolean;
  anchor?: Element;
  trigger: RefObject<HTMLSpanElement | null>;
  popupElement: HTMLElement | null;
  parentElement?: HTMLElement | null;
  parentPosition?: CSSProperties;
  onAnchorRemoved: () => void;
}) {
  const [position, setPosition] = useState<CSSProperties>({ visibility: 'hidden' });
  const dismiss = useEffectEvent(onAnchorRemoved);

  useLayoutEffect(() => {
    const target = anchor ?? trigger.current;
    if (!visible || !target || !popupElement) {return;}
    let frame: number | undefined;
    const update = () => {
      if (!target.isConnected) {dismiss(); return;}
      const rect = popupElement.getBoundingClientRect();
      const next = parentElement
        ? placeEntityPreviewBeside(parentElement.getBoundingClientRect(), rect.width, rect.height, window.innerWidth, window.innerHeight)
        : placeEntityPreview(target.getBoundingClientRect(), rect.width, rect.height, window.innerWidth, window.innerHeight);
      setPosition((current) => current.left === next.left && current.top === next.top && current.visibility === next.visibility
        ? current : next);
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
    window.addEventListener('scroll', scheduleUpdate, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
      if (frame !== undefined) {cancelAnimationFrame(frame);}
    };
  }, [visible, popupElement, parentElement, parentPosition, anchor, trigger]);

  return position;
}
