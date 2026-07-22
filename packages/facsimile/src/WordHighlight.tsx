import { useState } from 'react';
import { HighlightStyle } from './HighlightStyle.tsx';
import {
  CanvasId,
  setHovered,
  toggleClicked,
  useIsSelectedInFacsimile,
} from '@globalise/common/document';
import { Highlight } from './Highlight.tsx';
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
  {
    canvasId,
    id,
    points,
    text,
    tone,
    setTooltip,
  }: WordHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);
  const [hovered, setHoveredLocal] = useState(false);
  const colors = getEntityHighlightColors(tone);

  const highlightStyle: HighlightStyle = {
    fill: selected ? colors.fill
      : hovered ? colors.hoverFill
        : 'transparent',
    stroke: selected || hovered ? colors.stroke
      : 'transparent',
    strokeWidth: 1,
    haloStroke: selected || hovered
      ? 'rgb(255 255 255 / 0.9)'
      : undefined,
    haloStrokeWidth: 3,
    cursor: 'pointer',
    vectorEffect: 'non-scaling-stroke',
  };

  return (
    <Highlight
      ariaLabel={text}
      points={points}
      highlightStyle={highlightStyle}
      onClick={() => toggleClicked(id)}
      onFocusChange={(focused) => {
        setHoveredLocal(focused);
        setHovered(focused ? id : null);
        if (!focused) {
          setTooltip(null);
        }
      }}
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
