import { Overlay, useImageInfo } from '@knaw-huc/osd-iiif-viewer';
import { useMemo, useState } from 'react';
import {
  CanvasId,
  useAnnotations,
  useWordEntityClassifications,
} from '@globalise/common/document';
import { FacsimileTooltip, FacsimileTooltipProps } from './FacsimileTooltip';
import { BlockHighlight } from './BlockHighlight.tsx';
import { SelectedWordHighlights } from './SelectedWordHighlights.tsx';
import { WordHighlights } from './WordHighlights.tsx';
import { toBlockHighlightConfigs, toWordHighlightConfigs } from './HighlightConfig.ts';

export function FacsimileOverlay({ canvasId }: { canvasId: CanvasId }) {
  const imageInfo = useImageInfo();
  const annotations = useAnnotations(canvasId);
  const entityClassificationByWord = useWordEntityClassifications(canvasId);
  const [tooltip, setTooltip] = useState<FacsimileTooltipProps | null>(null);

  const words = useMemo(
    () => toWordHighlightConfigs(annotations, entityClassificationByWord),
    [annotations, entityClassificationByWord],
  );
  const blocks = useMemo(() => toBlockHighlightConfigs(annotations), [annotations]);

  if (!imageInfo) {
    return null;
  }

  return (
    <>
      <Overlay location={imageInfo.location}>
        <svg
          viewBox={`0 0 ${imageInfo.size.x} ${imageInfo.size.y}`}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {blocks.map(({ id, path }) => (
            <BlockHighlight
              key={id}
              canvasId={canvasId}
              id={id}
              points={path}
            />
          ))}
          <SelectedWordHighlights canvasId={canvasId} words={words}/>
          <WordHighlights words={words} setTooltip={setTooltip}/>
        </svg>
      </Overlay>
      {tooltip && <FacsimileTooltip x={tooltip.x} y={tooltip.y} text={tooltip.text}/>}
    </>
  );
}
