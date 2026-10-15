import { useSelectedCanvas } from '@globalise/common/document';
import type { CanvasDocuments } from '@globalise/metadata';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import { HighlightsOverlay } from './HighlightsOverlay.tsx';
import { CurrentCanvasBorderOverlay } from './CurrentCanvasBorderOverlay.tsx';
import { CanvasLabelsOverlay } from './CanvasLabelsOverlay.tsx';

export function CanvasOverlays({ canvasDocuments }: { canvasDocuments: Map<string, CanvasDocuments> }) {
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const loaded = lazyCollectionViewerStore((s) => s.loaded);
  const { id: selectedCanvasId } = useSelectedCanvas();
  const loadedCanvases = lazyCanvases.filter((c) => loaded.has(c.canvasId));

  return (
    <>
      {loadedCanvases.map((canvas) => <HighlightsOverlay
        key={canvas.canvasId}
        lazyCanvas={canvas}/>,
      )}
      {loadedCanvases.map((canvas) => <CanvasLabelsOverlay
        key={canvas.canvasId}
        lazyCanvas={canvas}
        canvasDocuments={canvasDocuments.get(canvas.canvasId)}
        isCurrent={canvas.canvasId === selectedCanvasId}/>,
      )}
      <CurrentCanvasBorderOverlay/>
    </>
  );
}
