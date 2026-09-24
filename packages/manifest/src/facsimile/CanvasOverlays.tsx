import { useSelectedCanvas } from '@globalise/common/document';
import { useCanvasDocuments } from '@globalise/metadata';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import { HighlightsOverlay } from './HighlightsOverlay.tsx';
import { CurrentCanvasOverlay } from './CurrentCanvasOverlay.tsx';
import { CanvasChipsOverlay } from './CanvasChipsOverlay.tsx';

export function CanvasOverlays() {
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const loaded = lazyCollectionViewerStore((s) => s.loaded);
  const canvasDocuments = useCanvasDocuments();
  const { id: selectedCanvasId } = useSelectedCanvas();
  const loadedCanvases = lazyCanvases.filter((c) => loaded.has(c.canvasId));

  return (
    <>
      {loadedCanvases.map((canvas) => <HighlightsOverlay
        key={canvas.canvasId}
        lazyCanvas={canvas}/>,
      )}
      {loadedCanvases.map((canvas) => <CanvasChipsOverlay
        key={canvas.canvasId}
        lazyCanvas={canvas}
        canvasDocuments={canvasDocuments.get(canvas.canvasId)}
        isCurrent={canvas.canvasId === selectedCanvasId}/>,
      )}
      <CurrentCanvasOverlay/>
    </>
  );
}
