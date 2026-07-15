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
      ? 'var(--color-layout-element-fill-strong, rgb(128 219 227 / 0.24))'
      : 'var(--color-layout-element-fill, rgb(128 219 227 / 0.1))',
    stroke: selected || hovered
      ? 'var(--color-layout-element-stroke-strong, rgb(18 94 100 / 0.7))'
      : 'var(--color-layout-element-stroke, rgb(18 94 100 / 0.5))',
    strokeWidth: selected || hovered ? 2 : 1,
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
