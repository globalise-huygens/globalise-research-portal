import { RefObject, useEffect, useRef } from 'react';
import { isCentered } from '@globalise/common';
import { useSelectedCanvas } from '@globalise/common/document';
import { debounce } from 'lodash';

export const dataCurrentScan = 'data-current-scan';

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
    `[${dataCurrentScan}="true"]`,
  );
  if (target && !isCentered(list, target)) {
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}