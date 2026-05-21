import {useMemo, useState} from 'react';
import {Rect} from 'openseadragon';
import {Overlay, useManifest} from '@knaw-huc/osd-iiif-viewer';
import {
  findSvgPath,
  findTextualBodyValue,
  isBlock,
  isWord,
  parseSvgPath,
} from '@globalise/common/annotation';
import {useAnnotations} from '@globalise/common/document';
import {orThrow} from '@globalise/common';
import {BlockHighlight, Tooltip, TooltipProps, WordHighlight} from '@globalise/facsimile';
import {useLazyCollectionViewerContext} from './LazyCollectionViewerContext';
import {useCollectionAnnotations} from './useCollectionAnnotations';

export function CollectionFacsimileOverlay() {
  useCollectionAnnotations();

  const {vault} = useManifest();
  const context = useLazyCollectionViewerContext();
  const [tooltip, setTooltip] = useState<TooltipProps | null>(null);

  const lazyCanvases = context.lazyCanvases.current;
  const visibleIndex = context.selectedCanvas;
  const lazyCanvas = lazyCanvases[visibleIndex];
  const canvasId = lazyCanvas.canvasId;
  const annotations = useAnnotations(canvasId);

  const canvasSize = useMemo(() => {
    if (!vault || !lazyCanvas) {
      return null;
    }
    const canvas = vault.get({id: lazyCanvas.canvasId, type: 'Canvas'});
    return {width: canvas.width, height: canvas.height};
  }, [vault, lazyCanvas?.canvasId]);

  const location = useMemo(() => {
    if (!lazyCanvas) {
      return null;
    }
    return new Rect(0, lazyCanvas.y, 1, lazyCanvas.height);
  }, [lazyCanvas?.y, lazyCanvas?.height]);

  const words = useMemo(() => {
    if (!annotations) {
      return [];
    }
    return Object.values(annotations)
      .filter(isWord)
      .map((a) => ({
        id: a.id,
        path: parseSvgPath(findSvgPath(a) || orThrow('No svg path')),
        text: findTextualBodyValue(a) || orThrow('No body value'),
      }));
  }, [annotations]);

  const blocks = useMemo(() => {
    if (!annotations) {
      return [];
    }
    return Object.values(annotations)
      .filter(isBlock)
      .map((a) => ({
        id: a.id,
        path: parseSvgPath(findSvgPath(a) || orThrow('No svg path')),
      }));
  }, [annotations]);

  if (!location || !canvasSize) {
    return null;
  }

  const canvasBorderColor = 'rgb(144 187 195)';

  return (
    <>
      <Overlay location={location}>
        <div style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          border: '0.33em solid ' + canvasBorderColor,
          pointerEvents: 'none',
        }}/>
      </Overlay>
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