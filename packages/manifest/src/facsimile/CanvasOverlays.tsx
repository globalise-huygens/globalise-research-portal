import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import { HighlightsOverlay } from './HighlightsOverlay.tsx';
import { CurrentCanvasOverlay } from './CurrentCanvasOverlay.tsx';

export function CanvasOverlays() {
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const loaded = lazyCollectionViewerStore((s) => s.loaded);

  return (
    <>
      {lazyCanvases
        .filter((c) => loaded.has(c.canvasId))
        .map((canvas) => <HighlightsOverlay
          key={canvas.canvasId}
          lazyCanvas={canvas}/>,
        )
      }
      <CurrentCanvasOverlay/>
    </>
  );
}