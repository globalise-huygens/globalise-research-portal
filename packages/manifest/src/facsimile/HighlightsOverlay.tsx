import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Rect } from 'openseadragon';
import { Overlay, useManifest } from '@knaw-huc/osd-iiif-viewer';
import {
  getAnnotationPages,
  loadCanvasAnnotationPages,
  useAnnotations,
  useWordEntityClassifications,
  useIsLayoutElementsVisible,
  useIsSelectedCanvas,
  usePages,
} from '@globalise/common/document';
import {
  BlockHighlight,
  FacsimileTooltip,
  FacsimileTooltipProps,
  SelectedWordHighlights,
  toBlockHighlightConfigs,
  toWordHighlightConfigs,
  WordHighlights,
} from '@globalise/facsimile';
import { LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';

type HighlightsOverlayProps = {
  lazyCanvas: LazyTiledImage,
};

export const HighlightsOverlay = memo(function HighlightsOverlay(
  { lazyCanvas }: HighlightsOverlayProps,
) {
  const { vault } = useManifest();
  const isTileLoaded = lazyCollectionViewerStore(
    (s) => s.loaded.has(lazyCanvas.canvasId),
  );
  const [tooltip, setTooltip] = useState<FacsimileTooltipProps | null>(null);
  const annotations = useAnnotations(lazyCanvas.canvasId);
  const entityClassificationByWord = useWordEntityClassifications(lazyCanvas.canvasId);
  const showLayoutElements = useIsLayoutElementsVisible();
  const { isReady, hasAnnotations } = usePages(lazyCanvas.canvasId);
  const isSelectedCanvas = useIsSelectedCanvas(lazyCanvas.canvasId);
  const isInteractive = useDeferredValue(isSelectedCanvas, false);

  const annotationPages = useMemo(() => {
    if (!vault) {
      return [];
    }
    const canvas = vault.get({ id: lazyCanvas.canvasId, type: 'Canvas' });
    return getAnnotationPages(vault, canvas);
  }, [vault, lazyCanvas.canvasId]);

  useEffect(() => {
    if (isTileLoaded && annotationPages.length) {
      void loadCanvasAnnotationPages(lazyCanvas.canvasId, annotationPages);
    }
  }, [isTileLoaded, lazyCanvas.canvasId, annotationPages]);


  let canvasSize: { width: number; height: number } | null = null;
  if (vault) {
    const canvas = vault.get({ id: lazyCanvas.canvasId, type: 'Canvas' });
    canvasSize = { width: canvas.width, height: canvas.height };
  }

  const location = useMemo(
    () => new Rect(0, lazyCanvas.y, 1, lazyCanvas.height),
    [lazyCanvas.y, lazyCanvas.height],
  );

  const words = useMemo(
    () => toWordHighlightConfigs(annotations, entityClassificationByWord),
    [annotations, entityClassificationByWord],
  );
  const blocks = useMemo(() => toBlockHighlightConfigs(annotations), [annotations]);

  if (!isTileLoaded || !isReady || !hasAnnotations || !canvasSize) {
    return null;
  }

  return (
    <>
      <Overlay location={location}>
        <svg
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {showLayoutElements && blocks.map(({ id, path }) => (
            <BlockHighlight
              key={id}
              canvasId={lazyCanvas.canvasId}
              id={id}
              points={path}
            />
          ))}
          <SelectedWordHighlights canvasId={lazyCanvas.canvasId} words={words}/>
          {isInteractive && <WordHighlights words={words} setTooltip={setTooltip}/>}
        </svg>
      </Overlay>
      {tooltip && <FacsimileTooltip x={tooltip.x} y={tooltip.y} text={tooltip.text}/>}
    </>
  );
});
