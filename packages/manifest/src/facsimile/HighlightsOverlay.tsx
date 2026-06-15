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
  loadCanvas,
  useAnnotations,
  usePages,
  useSelectedIdsForCanvas,
} from '@globalise/common/document';
import { orThrow } from '@globalise/common';
import { BlockHighlight, Tooltip, TooltipProps, WordHighlight } from '@globalise/facsimile';
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
  const [tooltip, setTooltip] = useState<TooltipProps | null>(null);
  const annotations = useAnnotations(lazyCanvas.canvasId);
  const { isReady, hasAnnotations } = usePages(lazyCanvas.canvasId);
  const selectedIds = useSelectedIdsForCanvas(lazyCanvas.canvasId);

  const annotationUrls = useMemo(() => {
    if (!vault) {
      return [];
    }
    const canvas = vault.get({ id: lazyCanvas.canvasId, type: 'Canvas' });
    return getAnnotationPageUrls(canvas);
  }, [vault, lazyCanvas.canvasId]);

  useEffect(() => {
    if (isTileLoaded && annotationUrls.length) {
      void loadCanvas(lazyCanvas.canvasId, annotationUrls);
    }
  }, [isTileLoaded, lazyCanvas.canvasId, annotationUrls]);


  let canvasSize: { width: number; height: number } | null = null;
  if (vault) {
    const canvas = vault.get({ id: lazyCanvas.canvasId, type: 'Canvas' });
    canvasSize = { width: canvas.width, height: canvas.height };
  }

  const location = useMemo(() => new Rect(0, lazyCanvas.y, 1, lazyCanvas.height), [lazyCanvas.y, lazyCanvas.height]);

  const words = useMemo(() => Object.values(annotations)
    .filter(isWord)
    .map((a) => ({
      id: a.id,
      path: parseSvgPath(findSvgPath(a) ?? orThrow('No svg path')),
      text: findTextualBodyValue(a) ?? orThrow('No body value'),
    })), [annotations]);

  const blocks = useMemo(() => Object.values(annotations)
    .filter(isBlock)
    .map((a) => ({
      id: a.id,
      path: parseSvgPath(findSvgPath(a) ?? orThrow('No svg path')),
    })), [annotations]);

  const isIdSelected = (id: string) => {
    if (!selectedIds.length) {
      return false;
    }
    return selectedIds.includes(id);
  };

  const isScrolling = useIsViewerScrolling();
  const isNotScrolling = !isScrolling;
  const visibleWords = useMemo(() => 
    isScrolling
      ? words.filter((w) => isIdSelected(w.id))
      : words
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [isNotScrolling, words, selectedIds]);

  const visibleBlocks = useMemo(() => 
    isScrolling
      ? blocks.filter((b) => isIdSelected(b.id))
      : blocks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [isNotScrolling, blocks, selectedIds]);

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
            <BlockHighlight key={id} id={id} points={path}/>
          ))}
          {visibleWords.map(({ id, path, text }) => (
            <WordHighlight
              key={id}
              id={id}
              points={path}
              text={text}
              setTooltip={setTooltip}
            />
          ))}
        </svg>
      </Overlay>
      {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} text={tooltip.text}/>}
    </>
  );
});