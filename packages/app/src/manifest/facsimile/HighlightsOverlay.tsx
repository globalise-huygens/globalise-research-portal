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
} from '@globalise/common/document';
import {orThrow} from '@globalise/common';
import {BlockHighlight, Tooltip, TooltipProps, WordHighlight} from '@globalise/facsimile';
import {useLazyCollectionViewerContext} from './LazyCollectionViewerContext';
import {LazyTiledImage} from './LazyCollectionViewerModel.ts';
import {getAnnotationPageUrls} from '../getAnnotationPageUrls.ts';

export function HighlightsOverlay(
  {lazyCanvas}: {lazyCanvas: LazyTiledImage}
) {
  const {vault} = useManifest();
  const {loadedCanvases} = useLazyCollectionViewerContext();
  const [tooltip, setTooltip] = useState<TooltipProps | null>(null);
  const annotations = useAnnotations(lazyCanvas.canvasId);
  const {isReady, hasAnnotations} = usePages(lazyCanvas.canvasId);

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

  let canvasSize: {width: number; height: number} | null = null;
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

  if (!isTileLoaded || !isReady || !hasAnnotations || !canvasSize) {
    return null;
  }

  return (
    <>
      <Overlay location={location}>
        <svg
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
          style={{width: '100%', height: '100%', pointerEvents: 'none'}}
        >
          {blocks.map(({id, path}) => (
            <BlockHighlight key={id} id={id} points={path}/>
          ))}
          {words.map(({id, path, text}) => (
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