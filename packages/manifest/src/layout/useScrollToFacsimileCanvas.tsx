import { setSelectedCanvas, type CanvasId } from '@globalise/common/document';
import { useViewer } from '@knaw-huc/osd-iiif-viewer';
import { Point } from 'openseadragon';
import { useCallback } from 'react';
import { lazyCollectionViewerStore } from '../facsimile/LazyCollectionViewerStore.ts';

export function useScrollToFacsimileCanvas() {
  const viewer = useViewer();
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);

  return useCallback((canvasId?: CanvasId) => {
    if (!canvasId) {
      return;
    }
    setSelectedCanvas(canvasId, 'external');
    if (!viewer) {
      return;
    }
    const canvas = lazyCanvases.find((c) => c.canvasId === canvasId);
    if (!canvas) {
      return;
    }
    viewer.viewport.panTo(new Point(0.5, canvas.y + canvas.height / 2));
  }, [viewer, lazyCanvases]);
}
