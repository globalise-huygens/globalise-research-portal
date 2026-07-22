import { useViewer } from '@knaw-huc/osd-iiif-viewer';
import { useCallback } from 'react';
import {
  useLazyCollectionViewerContext,
} from './LazyCollectionViewerContext.tsx';
import { Point } from 'openseadragon';
import type { CanvasId } from '@globalise/common/document';

export function useScrollToFacsimile() {
  const viewer = useViewer();
  const context = useLazyCollectionViewerContext();

  return useCallback((canvasId: CanvasId) => {
    if (!viewer || !context) {
      return;
    }
    const scan = context.lazyCanvases.current.find((c) => c.canvasId === canvasId);
    if (!scan) {
      return;
    }
    viewer.viewport.panTo(
      new Point(0.5, scan.y + scan.height / 2),
    );
  }, [viewer, context]);
}