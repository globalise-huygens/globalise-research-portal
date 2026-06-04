import {useEffect, useMemo, useState} from 'react';
import {Rect} from 'openseadragon';
import {Overlay, useManifest} from '@knaw-huc/osd-iiif-viewer';
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
import {orThrow} from '@globalise/common';
import {BlockHighlight, Tooltip, TooltipProps, WordHighlight} from '@globalise/facsimile';
import {useLazyCollectionViewerContext} from './LazyCollectionViewerContext';
import {LazyTiledImage} from './LazyCollectionViewerModel.ts';
import {getAnnotationPageUrls} from '../getAnnotationPageUrls.ts';
import {useIsViewerScrolling} from './useIsViewerScrolling.tsx';

type HighlightsOverlayProps = {
  lazyCanvas: LazyTiledImage,
  canvasIndex: number
};

export function HighlightsOverlay(
  {lazyCanvas, canvasIndex}: HighlightsOverlayProps
) {
  const {vault} = useManifest();
  const {loadedCanvases} = useLazyCollectionViewerContext();
  const [tooltip, setTooltip] = useState<TooltipProps | null>(null);
  const annotations = useAnnotations(lazyCanvas.canvasId);
  const {isReady, hasAnnotations} = usePages(lazyCanvas.canvasId);
  const selectedIds = useSelectedIdsForCanvas(lazyCanvas.canvasId);

  const isTileLoaded = loadedCanvases.has(lazyCanvas.canvasId);

  const annotationUrls = useMemo(() => {
    if (!vault) {
      return [];
    }
    const canvas = vault.get({id: lazyCanvas.canvasId, type: 'Canvas'});
    return getAnnotationPageUrls(canvas);
  }, [vault, lazyCanvas.canvasId]);

  useEffect(() => {
    if (isTileLoaded && annotationUrls.length) {
      loadCanvas(lazyCanvas.canvasId, annotationUrls);
    }
  }, [isTileLoaded, lazyCanvas.canvasId, annotationUrls]);

  let canvasSize: { width: number; height: number } | null = null;
  if (vault) {
    const canvas = vault.get({id: lazyCanvas.canvasId, type: 'Canvas'});
    canvasSize = {width: canvas.width, height: canvas.height};
  }

  const location = useMemo(() => {
    return new Rect(0, lazyCanvas.y, 1, lazyCanvas.height);
  }, [lazyCanvas.y, lazyCanvas.height]);

  const words = useMemo(() => {
    return Object.values(annotations)
      .filter(isWord)
      .map((a) => ({
        id: a.id,
        path: parseSvgPath(findSvgPath(a) || orThrow('No svg path')),
        text: findTextualBodyValue(a) || orThrow('No body value'),
      }));
  }, [annotations]);

  const blocks = useMemo(() => {
    return Object.values(annotations)
      .filter(isBlock)
      .map((a) => ({
        id: a.id,
        path: parseSvgPath(findSvgPath(a) || orThrow('No svg path')),
      }));
  }, [annotations]);

  const isIdSelected = (id: string) => {
    if (!selectedIds) {
      return false;
    }
    return selectedIds.includes(id);
  };

  const isScrolling = useIsViewerScrolling();
  const visibleWords = useMemo(() => {
    return isScrolling
      ? words.filter(w => isIdSelected(w.id))
      : words;
  }, [!isScrolling, words, selectedIds]);

  const visibleBlocks = useMemo(() => {
    return isScrolling
      ? blocks.filter(b => isIdSelected(b.id))
      : blocks;
  }, [!isScrolling, blocks, selectedIds]);

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
          style={{width: '100%', height: '100%', pointerEvents: 'none'}}
        >
          {visibleBlocks.map(({id, path}) => (
            <BlockHighlight key={id} id={id} points={path}/>
          ))}
          {visibleWords.map(({id, path, text}) => (
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
}