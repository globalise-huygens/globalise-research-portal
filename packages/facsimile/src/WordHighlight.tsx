import { type MouseEvent, useState } from 'react';
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

export function WordHighlight(
  { canvasId, id, points, text, tone, setTooltip }: WordHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);
  const [hovered, setHoveredLocal] = useState(false);
  const colors = getEntityHighlightColors(tone);

  const fill = selected ? colors.fill
    : hovered ? colors.hoverFill
      : 'transparent';

  function handleHover(hovering: boolean, event: MouseEvent) {
    setHoveredLocal(hovering);
    const rect = event.currentTarget.getBoundingClientRect();
    setHovered(
      hovering ? id : null,
      hovering ? {
        element: event.currentTarget,
        x: event.clientX,
        y: event.clientY,
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      } : undefined,
    );
    if (hovering && !tone) {
      setTooltip({ text, x: event.clientX, y: event.clientY });
    } else {
      setTooltip(null);
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
      onClick={() => toggleClicked(id)}
      onMouseEnter={(event) => handleHover(true, event)}
      onMouseMove={(event) => handleHover(true, event)}
      onMouseLeave={(event) => handleHover(false, event)}
    />
  );
}
