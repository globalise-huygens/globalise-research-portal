import {
  useLazyCollectionViewerContext
} from "./LazyCollectionViewerContext.tsx";
import {HighlightsOverlay} from "./HighlightsOverlay.tsx";
import {CurrentCanvasOverlay} from "./CurrentCanvasOverlay.tsx";

export function Overlay() {
  const {lazyCanvases} = useLazyCollectionViewerContext();
  return (
    <>
      {lazyCanvases.current.map(c => (
        <HighlightsOverlay key={c.canvasId} lazyCanvas={c}/>
      ))}
      <CurrentCanvasOverlay/>
    </>
  );
}