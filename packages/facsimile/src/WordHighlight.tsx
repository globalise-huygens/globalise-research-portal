import { memo, type MouseEvent, useState } from 'react';
import { usePointerDown } from '@knaw-huc/osd-iiif-viewer';
import {
  CanvasId,
  setHovered,
  toggleClicked,
  useIsSelectedInFacsimile,
} from '@globalise/common/document';
import { FacsimileTooltipProps } from './FacsimileTooltip.tsx';
import { Id } from '@globalise/common/annotation';
import {
  EntityHighlightTone,
  getEntityHighlightColors,
} from './EntityHighlightTone.ts';

type WordHighlightProps = {
  canvasId: CanvasId;
  id: Id;
  points: string;
  text: string;
  tone?: EntityHighlightTone;
  setTooltip: (tooltip: FacsimileTooltipProps | null) => void;
};

export const WordHighlight = memo(function WordHighlight(
  { canvasId, id, points, text, tone, setTooltip }: WordHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);
  const [hovered, setHoveredLocal] = useState(false);
  const colors = getEntityHighlightColors(tone);
  const handlePointerDown = usePointerDown({
    onClick: () => toggleClicked(id),
  });

  const fill = selected ? colors.fill
    : hovered ? colors.hoverFill
      : 'transparent';

  function handleHover(hovering: boolean, event: MouseEvent) {
    setHoveredLocal(hovering);
    setHovered(hovering ? id : null);
    if (!hovering) {
      setTooltip(null);
    } else {
      setTooltip({ text, x: event.clientX, y: event.clientY });
    }
  }

  return (
    <polygon
      points={points}
      fill={fill}
      stroke="none"
      strokeWidth={0}
      style={{
        pointerEvents: 'auto',
        cursor: 'pointer',
        mixBlendMode: 'multiply',
      }}
      onPointerDown={handlePointerDown}
      onMouseEnter={(event) => handleHover(true, event)}
      onMouseMove={(event) => handleHover(true, event)}
      onMouseLeave={(event) => handleHover(false, event)}
    />
  );
});
