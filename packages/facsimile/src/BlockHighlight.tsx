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
      ? 'var(--color-layout-element-fill-strong, rgb(41 191 204 / 0.13))'
      : hovered
        ? 'var(--color-layout-element-fill, rgb(41 191 204 / 0.08))'
        : 'transparent',
    stroke: selected || hovered
      ? 'var(--color-layout-element-stroke-strong, #125e64)'
      : 'var(--color-layout-element-stroke, rgb(18 94 100 / 0.38))',
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
