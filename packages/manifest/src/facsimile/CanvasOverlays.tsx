import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';
import { HighlightsOverlay } from './HighlightsOverlay.tsx';
import { CurrentCanvasOverlay } from './CurrentCanvasOverlay.tsx';
import { DebugOverlay } from './DebugOverlay.tsx';
import { Fragment } from 'react';

export function CanvasOverlays() {
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const loaded = lazyCollectionViewerStore((s) => s.loaded);

  return (
    <>
      {lazyCanvases
        .filter((c) => loaded.has(c.canvasId))
        .map((canvas) => <Fragment key={canvas.canvasId}>
          <DebugOverlay lazyCanvas={canvas}/>
          <HighlightsOverlay lazyCanvas={canvas}/>
        </Fragment>)
      }
      <CurrentCanvasOverlay/>
    </>
  );
}