import { useMemo } from 'react';
import { Rect } from 'openseadragon';
import { Overlay } from '@knaw-huc/osd-iiif-viewer';
import { useSelectedCanvas } from '@globalise/common/document';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import { scanLabel } from '@globalise/common/annotation';
import './CurrentCanvasOverlay.css';

export function CurrentCanvasOverlay() {
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const { isInit, id } = useSelectedCanvas();

  const lazyCanvas = lazyCanvases.find((c) => c.canvasId === id);
  const canvasY = lazyCanvas?.y;
  const canvasHeight = lazyCanvas?.height;

  const location = useMemo(() => {
    if (canvasY === undefined || canvasHeight === undefined) {
      return null;
    }
    return new Rect(0, canvasY, 1, canvasHeight);
  }, [canvasY, canvasHeight]);

  if (!isInit || !location) {
    return null;
  }
  const label = scanLabel(id);

  return (
    <Overlay location={location}>
      <div
        className="current-canvas-overlay"
        role="group"
        aria-current="true"
        aria-label={`Current ${label}`}
      >
        <span className="label" aria-hidden="true">
          {label}
        </span>
      </div>
    </Overlay>
  );
}
