import { memo, useEffect, useMemo, useState } from 'react';
import { Rect } from 'openseadragon';
import { Overlay, useManifest } from '@knaw-huc/osd-iiif-viewer';
import {
  findSvgPath,
  findTextualBodyValue,
  isBlock,
  isWord,
  parseSvgPath,
} from '@globalise/common/annotation';
import {
  loadCanvasAnnotationPages,
  useAnnotations,
  useWordEntityClassifications,
  useIsLayoutElementsVisible,
  usePages,
  useSelectedAnnotationsInFacsimile,
} from '@globalise/common/document';
import { orThrow } from '@globalise/common';
import {
  BlockHighlight,
  FacsimileTooltip,
  FacsimileTooltipProps,
  WordHighlight,
} from '@globalise/facsimile';
import { LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { getAnnotationPageUrls } from '../getAnnotationPageUrls.ts';
import { useIsViewerScrolling } from './useIsViewerScrolling.tsx';
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
  const selected = useSelectedAnnotationsInFacsimile(lazyCanvas.canvasId);

  const annotationUrls = useMemo(() => {
    if (!vault) {
      return [];
    }
    const canvas = vault.get({ id: lazyCanvas.canvasId, type: 'Canvas' });
    return getAnnotationPageUrls(canvas.annotations);
  }, [vault, lazyCanvas.canvasId]);

  useEffect(() => {
    if (isTileLoaded && annotationUrls.length) {
      void loadCanvasAnnotationPages(lazyCanvas.canvasId, annotationUrls);
    }
  }, [isTileLoaded, lazyCanvas.canvasId, annotationUrls]);


  let canvasSize: { width: number; height: number } | null = null;
  if (vault) {
    const canvas = vault.get({ id: lazyCanvas.canvasId, type: 'Canvas' });
    canvasSize = { width: canvas.width, height: canvas.height };
  }

  const location = useMemo(
    () => new Rect(0, lazyCanvas.y, 1, lazyCanvas.height), 
    [lazyCanvas.y, lazyCanvas.height],
  );

  const words = useMemo(() => Object.values(annotations)
    .filter(isWord)
    .map((a) => ({
      id: a.id,
      path: parseSvgPath(findSvgPath(a) ?? orThrow('No svg path')),
      text: findTextualBodyValue(a) ?? orThrow('No body value'),
      entityClassificationId: entityClassificationByWord[a.id],
    })), [annotations, entityClassificationByWord]);

  const blocks = useMemo(() => Object.values(annotations)
    .filter(isBlock)
    .map((a) => ({
      id: a.id,
      path: parseSvgPath(findSvgPath(a) ?? orThrow('No svg path')),
    })), [annotations]);

  const isScrolling = useIsViewerScrolling();
  const visibleWords = useMemo(() => {
    if(!isScrolling) {
      return words;
    }
    if(!selected.all.length) {
      return [];
    }
    return words.filter((w) => selected.all.includes(w.id));
  },
  [isScrolling, words, selected]);

  const visibleBlocks = useMemo(() => {
    if (!showLayoutElements) {
      return [];
    }
    if(!isScrolling) {
      return blocks;
    }
    if(!selected.all.length) {
      return [];
    }
    return blocks.filter((b) => selected.all.includes(b.id));
  },
  [isScrolling, blocks, selected, showLayoutElements]);

  if (!isTileLoaded || !isReady || !hasAnnotations || !canvasSize) {
    return null;
  }

  if (!visibleWords.length && !visibleBlocks.length) {
    return null;
  }

  return (
    <>
      <Overlay location={location}>
        <svg
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {visibleBlocks.map(({ id, path }) => (
            <BlockHighlight
              key={id}
              canvasId={lazyCanvas.canvasId}
              id={id}
              points={path}
            />
          ))}
          {visibleWords.map(({ id, path, text, entityClassificationId }) => (
            <WordHighlight
              key={id}
              canvasId={lazyCanvas.canvasId}
              id={id}
              points={path}
              text={text}
              entityClassificationId={entityClassificationId}
              setTooltip={setTooltip}
            />
          ))}
        </svg>
      </Overlay>
      {tooltip && <FacsimileTooltip x={tooltip.x} y={tooltip.y} text={tooltip.text}/>}
    </>
  );
});
