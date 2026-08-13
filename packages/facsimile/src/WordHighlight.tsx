import { type MouseEvent, useState } from 'react';
import {
  CanvasId,
  createHoverAnchor,
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
    if (!hovering && document.activeElement === event.currentTarget) {
      return;
    }
    setHovered(
      hovering ? id : null,
      hovering ? createHoverAnchor(event.currentTarget) : undefined,
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
      tabIndex={tone ? 0 : undefined}
      role={tone ? 'button' : undefined}
      aria-label={tone ? `Preview entity: ${text}` : undefined}
      onClick={() => toggleClicked(id)}
      onMouseEnter={(event) => handleHover(true, event)}
      onMouseMove={(event) => {
        if (!tone) {
          handleHover(true, event);
        }
      }}
      onMouseLeave={(event) => handleHover(false, event)}
      onFocus={(event) => {
        if (tone) {
          setHovered(id, createHoverAnchor(event.currentTarget, true));
        }
      }}
      onBlur={() => setHovered(null)}
      onPointerDown={(event) => {
        if (tone && event.pointerType !== 'mouse') {
          setHovered(id, createHoverAnchor(event.currentTarget, true));
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleClicked(id);
        }
      }}
    />
  );
}
