import {Overlay, useImageInfo} from '@knaw-huc/osd-iiif-viewer';
import {useMemo, useState} from 'react';
import {
  findSvgPath,
  findTextualBodyValue, Id,
  isBlock,
  isWord,
  parseSvgPath,
} from '@globalise/common/annotation';
import {
  CanvasId,
  useAnnotations,
} from '@globalise/common/document';
import {Tooltip, TooltipProps} from './Tooltip';
import {BlockHighlight} from './BlockHighlight.tsx';
import {WordHighlight} from './WordHighlight.tsx';
import { orThrow } from '@globalise/common';

export function FacsimileOverlay({canvasId}: {canvasId: CanvasId}) {
  const imageInfo = useImageInfo();
  const annotations = useAnnotations(canvasId);
  const [tooltip, setTooltip] = useState<TooltipProps | null>(null);

  const words = useMemo(() => {
    if (!annotations) {
      return [];
    }
    return Object.values(annotations)
      .filter(isWord)
      .map((a) => ({
        id: a.id,
        path: parseSvgPath(findSvgPath(a) ?? orThrow('No svg path')),
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
        path: parseSvgPath(findSvgPath(a) ?? orThrow('No svg path')),
      }));
  }, [annotations]);

  if (!imageInfo) {
    return null;
  }

  return (
    <>
      <Overlay location={imageInfo.location}>
        <svg
          viewBox={`0 0 ${imageInfo.size.x} ${imageInfo.size.y}`}
          style={{width: '100%', height: '100%', pointerEvents: 'none'}}
        >
          {blocks.map(({id, path}) => (
            <BlockHighlight
              key={id}
              id={id}
              points={path}
            />
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