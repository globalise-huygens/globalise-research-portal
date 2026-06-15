import { useViewer } from '@knaw-huc/osd-iiif-viewer';
import { useCallback } from 'react';
import {
  useLazyCollectionViewerContext,
} from './LazyCollectionViewerContext.tsx';
import { Point } from 'openseadragon';

export function useScrollTo() {
  const viewer = useViewer();
  const context = useLazyCollectionViewerContext();

  return useCallback((index: number) => {
    if (!viewer || !context) {
      return;
    }
    const scan = context.lazyCanvases.current[index];
    if (!scan) {
      return;
    }
    viewer.viewport.panTo(
      new Point(0.5, scan.y + scan.height / 2),
    );
  }, [viewer, context]);
}