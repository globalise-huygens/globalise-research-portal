import { useState } from 'react';
import { CanvasId, setHovered, useIsSelectedInFacsimile } from '@globalise/common/document';
import { Highlight } from './Highlight.tsx';
import { Id } from '@globalise/common/annotation';
import { HighlightStyle } from './HighlightStyle.tsx';

type BlockHighlightProps = {
  canvasId: CanvasId;
  id: Id;
  points: string;
};

export function BlockHighlight(
  { canvasId, id, points }: BlockHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);
  const [hovered, setHoveredLocal] = useState(false);

  const highlightStyle: HighlightStyle = {
    fill: selected
      ? 'var(--color-layout-element-fill-strong, rgb(77 77 77 / 0.13))'
      : 'var(--color-layout-element-fill, rgb(77 77 77 / 0.08))',
    stroke: selected || hovered
      ? 'var(--color-layout-element-stroke-strong, rgb(38 38 38 / 0.82))'
      : 'var(--color-layout-element-stroke, rgb(77 77 77 / 0.62))',
    strokeWidth: selected || hovered ? 2 : 1,
    haloStroke:
      'var(--color-layout-element-halo, rgb(255 255 255 / 0.78))',
    haloStrokeWidth: selected || hovered ? 4 : 2.5,
    vectorEffect: 'non-scaling-stroke',
  };

  return (
    <Highlight
      points={points}
      highlightStyle={highlightStyle}
      onHover={(hovering) => {
        setHoveredLocal(hovering);
        setHovered(hovering ? id : null);
      }}
    />
  );
}
