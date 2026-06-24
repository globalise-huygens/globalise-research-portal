import { useMemo } from 'react';
import { Rect } from 'openseadragon';
import { Overlay } from '@knaw-huc/osd-iiif-viewer';
import { useSelectedCanvas } from '@globalise/common/document';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import { canvasName } from '@globalise/common/annotation';

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
  const name = canvasName(id);

  const canvasBorderColor = 'rgb(144 187 195)';
  const canvasColor = 'rgb(57 92 99)';
  return (
    <Overlay location={location}>
      <div style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        border: '0.33em solid ' + canvasBorderColor,
        pointerEvents: 'none',
        textAlign: 'right',
        color: canvasColor,
        padding: '0.25rem',
        fontSize: '0.8rem',
      }}>
        {name}
      </div>
    </Overlay>
  );
}