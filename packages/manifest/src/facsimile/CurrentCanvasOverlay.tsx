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
  const label = scanLabel(id);

  return (
    <Overlay location={location}>
      <div
        className="current-canvas"
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
