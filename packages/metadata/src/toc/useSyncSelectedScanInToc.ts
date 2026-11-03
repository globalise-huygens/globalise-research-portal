import { useEffect, useRef } from 'react';
import { useSelectedCanvas } from '@globalise/common/document';
import { isVisible } from '@globalise/common';
import debounce from 'lodash/debounce';
import { scrollToScan, type ScanScrollRefs } from './scrollToScan';

const scrollDebounce = 100; // ms

export type SyncSelectedScanInTocProps = ScanScrollRefs & {
  isCurrent: boolean;
};

export function useSyncSelectedScanInToc(
  {
    isCurrent,
    listRef,
    headerRef,
    scanRef,
  }: SyncSelectedScanInTocProps,
) {
  const { id: selectedCanvasId, selectedCanvasSource } = useSelectedCanvas();
  const sync = useRef(debounce(syncSelectedScan, scrollDebounce));
  const previousCanvasId = useRef<string | null>(null);

  useEffect(
    syncOnSelectedCanvasChange,
    [selectedCanvasId, selectedCanvasSource, isCurrent, listRef, headerRef, scanRef],
  );

  useEffect(cancelSyncOnUnmount, []);

  function syncOnSelectedCanvasChange() {
    sync.current.cancel();
    const changed = previousCanvasId.current !== selectedCanvasId;
    previousCanvasId.current = selectedCanvasId;
    if (!changed || !isCurrent || selectedCanvasSource === 'external') {
      return;
    }
    sync.current({ listRef, headerRef, scanRef });
  }

  function cancelSyncOnUnmount() {
    const debounced = sync.current;
    return () => debounced.cancel();
  }
}

function syncSelectedScan({ listRef, headerRef, scanRef }: ScanScrollRefs) {
  const list = listRef.current;
  const header = headerRef.current;
  const scan = scanRef.current;
  if (list && header && scan && !isVisible(list, scan, header.offsetHeight)) {
    scrollToScan(list, scan, header);
  }
}
