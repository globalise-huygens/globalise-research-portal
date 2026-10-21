import { RefObject, useEffect, useRef } from 'react';
import { isCentered } from '@globalise/common';
import { useDocumentStore, useSelectedCanvas } from '@globalise/common/document';
import { debounce } from 'lodash';

const scrollDebounce = 100; // ms

export function useScrollToThumb(listRef: RefObject<HTMLDivElement | null>) {
  const { id: selectedCanvasId, selectedCanvasSource } = useSelectedCanvas();
  const scroll = useRef(debounce(scrollToSelectedThumb, scrollDebounce));
  const previousCanvasId = useRef<string | null>(null);
  const revealRequest = useDocumentStore((s) => s.toc.revealRequest);

  useEffect(() => {
    const list = listRef.current;
    const canvasChanged = previousCanvasId.current !== selectedCanvasId;
    previousCanvasId.current = selectedCanvasId;
    if (!list || !selectedCanvasId || revealRequest) {
      scroll.current.cancel();
      return;
    }
    if (!canvasChanged || selectedCanvasSource === 'external') {
      return;
    }
    scroll.current(list);
  }, [selectedCanvasId, selectedCanvasSource, listRef, revealRequest]);

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
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}
