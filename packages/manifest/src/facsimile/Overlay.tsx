import {
  useLazyCollectionViewerContext,
} from './LazyCollectionViewerContext.tsx';
import { HighlightsOverlay } from './HighlightsOverlay.tsx';
import { CurrentCanvasOverlay } from './CurrentCanvasOverlay.tsx';

export function Overlay() {
  const { lazyCanvases, loadedCanvases } = useLazyCollectionViewerContext();
  return (
    <>
      {lazyCanvases.current
        .filter((c) => loadedCanvases.has(c.canvasId))
        .map((canvas) => {
          return <HighlightsOverlay
            key={canvas.canvasId}
            lazyCanvas={canvas}
          />;
        })}
      <CurrentCanvasOverlay/>
    </>
  );
}