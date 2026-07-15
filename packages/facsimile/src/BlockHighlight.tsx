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
      ? 'var(--color-layout-element-fill-strong, rgb(185 155 127 / 0.22))'
      : 'var(--color-layout-element-fill, rgb(185 155 127 / 0.1))',
    stroke: selected || hovered
      ? 'var(--color-layout-element-stroke-strong, rgb(78 65 53 / 0.92))'
      : 'var(--color-layout-element-stroke, rgb(93 71 54 / 0.58))',
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
