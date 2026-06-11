import { useManifest, useViewerReady } from '@knaw-huc/osd-iiif-viewer';
import { useScrollTo } from './useScrollTo.tsx';
import { getValue } from '@iiif/helpers/i18n';
import { useLazyCollectionViewerContext } from './LazyCollectionViewerContext.tsx';
import { useSelectedCanvas } from '@globalise/common/document';

export function ManifestFacsimileControls() {
  const ready = useViewerReady();
  const { vault } = useManifest();
  const context = useLazyCollectionViewerContext();
  const scrollTo = useScrollTo();

  const lazyCanvases = context.lazyCanvases.current;
  const { index: selectedIndex } = useSelectedCanvas();

  if (!ready || !lazyCanvases.length) {
    return null;
  }

  const lazyCanvas = lazyCanvases[selectedIndex];
  const canvas = lazyCanvas && vault
    ? vault.get({ id: lazyCanvas.canvasId, type: 'Canvas' })
    : null;
  const label = canvas
    ? getValue(canvas.label)
    : `Scan ${selectedIndex + 1}`;

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < lazyCanvases.length - 1;

  return (
    <>
      <button
        onClick={() => { scrollTo(selectedIndex - 1); }}
        disabled={!hasPrev}
      >
        Prev
      </button>
      <span>{label}&nbsp;({selectedIndex + 1}/{lazyCanvases.length})</span>
      <button
        onClick={() => { scrollTo(Math.floor(Math.random() * lazyCanvases.length)); }}
      >
        I'm Feeling Lucky
      </button>
      <button
        onClick={() => { scrollTo(selectedIndex + 1); }}
        disabled={!hasNext}
      >
        Next
      </button>
    </>
  );
}