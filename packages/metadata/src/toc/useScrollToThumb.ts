import { RefObject, useEffect, useRef } from 'react';
import { useSelectedCanvas } from '@globalise/common/document';
import debounce from 'lodash/debounce';

const scrollDebounce = 100; // ms

export function useScrollToThumb(listRef: RefObject<HTMLDivElement | null>) {
  const { id: selectedCanvasId, selectedCanvasSource } = useSelectedCanvas();
  const scroll = useRef(debounce(scrollToSelectedThumb, scrollDebounce));
  const previousCanvasId = useRef<string | null>(null);

  useEffect(() => {
    scroll.current.cancel();
    const changed = previousCanvasId.current !== selectedCanvasId;
    previousCanvasId.current = selectedCanvasId;
    const list = listRef.current;
    if (!changed || !list || !selectedCanvasId) {
      return;
    }
    if (selectedCanvasSource === 'external') {
      return;
    }
    scroll.current(list);
  }, [selectedCanvasId, selectedCanvasSource, listRef]);

  useEffect(() => {
    const debounced = scroll.current;
    return () => debounced.cancel();
  }, []);
}

function scrollToSelectedThumb(list: HTMLDivElement) {
  const target = list.querySelector<HTMLElement>(
    '.toc-document[data-current="true"] .toc-card[aria-current="true"]',
  ) ?? list.querySelector<HTMLElement>(
    ':scope > .toc-card[aria-current="true"]',
  );
  if (target) {
    const header = target.closest('.toc-document')?.querySelector<HTMLElement>('.header');
    const offset = header?.offsetHeight ?? 0;
    const bounds = list.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    if (rect.top < bounds.top + offset || rect.bottom > bounds.bottom) {
      scrollToTocElement(list, target, offset);
    }
  }
}

export function scrollToTocElement(list: HTMLElement, target: HTMLElement, offset = 0) {
  list.scrollTo({
    top: list.scrollTop + target.getBoundingClientRect().top - list.getBoundingClientRect().top - offset,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
}
