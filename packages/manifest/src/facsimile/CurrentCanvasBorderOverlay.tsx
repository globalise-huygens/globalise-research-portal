import { useMemo } from 'react';
import { Rect } from 'openseadragon';
import { CanvasOverlay } from './CanvasOverlay.tsx';
import { useSelectedCanvas } from '@globalise/common/document';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import './CurrentCanvasOverlay.css';

export function CurrentCanvasBorderOverlay() {
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const { isInit, id } = useSelectedCanvas();

  const lazyCanvas = lazyCanvases.find((c) => c.canvasId === id);

  const location = useMemo(() => {
    if (!lazyCanvas) {
      return null;
    }
    return new Rect(0, lazyCanvas.y, 1, lazyCanvas.height);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyCanvas?.y, lazyCanvas?.height]);

  if (!isInit || !location) {
    return null;
  }

  return (
    <CanvasOverlay location={location}>
      <div className="current-canvas-overlay"/>
    </CanvasOverlay>
  );
}
