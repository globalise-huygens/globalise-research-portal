import { RefObject, useEffect, useRef } from 'react';
import { isCentered } from '@globalise/common';
import { useSelectedCanvas } from '@globalise/common/document';
import { debounce } from 'lodash';

const scrollDebounce = 100; // ms

export function useScrollToThumb(listRef: RefObject<HTMLDivElement | null>) {
  const { id: selectedCanvasId, selectedCanvasSource } = useSelectedCanvas();
  const scroll = useRef(debounce(scrollToSelectedThumb, scrollDebounce));

  useEffect(() => {
    const list = listRef.current;
    if (!list || !selectedCanvasId) {
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
    '.toc-card[aria-current="true"]',
  );
  if (target && !isCentered(list, target)) {
    const header = target.closest('.toc-document')?.querySelector<HTMLElement>('.header');
    scrollToTocElement(list, target, header?.offsetHeight ?? 0);
  }
}

export function scrollToTocElement(list: HTMLElement, target: HTMLElement, offset = 0) {
  list.scrollTo({
    top: list.scrollTop + target.getBoundingClientRect().top - list.getBoundingClientRect().top - offset,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
}
