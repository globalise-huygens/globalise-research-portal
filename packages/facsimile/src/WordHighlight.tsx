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
    fill: selected ? 'rgba(0,255,0,0.35)'
      : hovered ? 'rgba(0,0,0,0.1)'
        : 'transparent',
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