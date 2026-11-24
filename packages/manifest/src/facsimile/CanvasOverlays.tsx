import { useCanvasDocuments } from '@globalise/metadata';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import { HighlightsOverlay } from './HighlightsOverlay.tsx';
import { CurrentCanvasBorderOverlay } from './CurrentCanvasBorderOverlay.tsx';

export function CanvasOverlays() {
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const loaded = lazyCollectionViewerStore((s) => s.loaded);
  const canvasDocuments = useCanvasDocuments();
  const loadedCanvases = lazyCanvases.filter((c) => loaded.has(c.canvasId));

  return (
    <>
      {loadedCanvases.map((canvas) => <HighlightsOverlay
        key={canvas.canvasId}
        lazyCanvas={canvas}
        canvasDocuments={canvasDocuments.get(canvas.canvasId)}
      />)}
      <CurrentCanvasBorderOverlay/>
    </>
  );
}
