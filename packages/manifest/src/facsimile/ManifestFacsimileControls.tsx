import { useManifest, useViewerReady } from '@knaw-huc/osd-iiif-viewer';
import { useScrollTo } from './useScrollTo.tsx';
import { getValue } from '@iiif/helpers/i18n';
import { useSelectedCanvas } from '@globalise/common/document';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';

export function ManifestFacsimileControls() {
  const ready = useViewerReady();
  const { vault } = useManifest();
  const scrollTo = useScrollTo();

  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const { id: selectedCanvasId } = useSelectedCanvas();
  const selectedIndex = lazyCanvases.findIndex((c) => c.canvasId === selectedCanvasId);

  if (!ready || !lazyCanvases.length || selectedIndex === -1) {
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

  const prevId = hasPrev && lazyCanvases[selectedIndex - 1].canvasId;
  const nextId = hasNext && lazyCanvases[selectedIndex + 1]?.canvasId;

  return (
    <>
      <button
        onClick={() => prevId && scrollTo(prevId)}
        disabled={!hasPrev}
      >
        Prev
      </button>
      <span>{label}&nbsp;({selectedIndex + 1}/{lazyCanvases.length})</span>
      <button
        onClick={() => {
          const randomIndex = Math.floor(Math.random() * lazyCanvases.length);
          const randomId = lazyCanvases[randomIndex].canvasId;
          scrollTo(randomId);
        }}
      >
        I'm Feeling Lucky
      </button>
      <button
        onClick={() => nextId && scrollTo(nextId)}
        disabled={!hasNext}
      >
        Next
      </button>
    </>
  );
}