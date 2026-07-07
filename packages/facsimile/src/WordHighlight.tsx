import { useState } from 'react';
import { HighlightStyle } from './HighlightStyle.tsx';
import {
  CanvasId,
  setHovered,
  toggleClicked,
  useIsSelectedInFacsimile,
} from '@globalise/common/document';
import { Highlight } from './Highlight.tsx';
import { TooltipProps } from './Tooltip.tsx';
import { Id } from '@globalise/common/annotation';

type WordHighlightProps = {
  canvasId: CanvasId;
  id: Id;
  points: string;
  text: string;
  setTooltip: (tooltip: TooltipProps | null) => void;
};

export function WordHighlight(
  { canvasId, id, points, text, setTooltip }: WordHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);
  const [hovered, setHoveredLocal] = useState(false);

  const highlightStyle: HighlightStyle = {
    fill: selected ? 'rgba(255, 84, 61, 0.34)'
      : hovered ? 'rgba(41, 191, 204, 0.2)'
        : 'transparent',
    stroke: selected ? 'rgba(255, 84, 61, 0.95)'
      : hovered ? 'rgba(41, 191, 204, 0.75)'
        : 'transparent',
    strokeWidth: selected ? 2 : 1,
    cursor: 'pointer',
  };

  return (
    <Highlight
      points={points}
      highlightStyle={highlightStyle}
      onClick={() => toggleClicked(id)}
      onHover={(hovering, e) => {
        setHoveredLocal(hovering);
        setHovered(hovering ? id : null);
        if (!hovering) {
          setTooltip(null);
        } else {
          setTooltip({ text, x: e.clientX, y: e.clientY });
        }
      }}
    />
  );
}
