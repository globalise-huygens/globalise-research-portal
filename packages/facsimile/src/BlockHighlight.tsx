import { useState } from 'react';
import { CanvasId, setHovered, useIsSelectedInFacsimile } from '@globalise/common/document';
import { Highlight } from './Highlight.tsx';
import { Id } from '@globalise/common/annotation';
import { getBlockHighlightStyle } from './BlockHighlightStyle.ts';

type BlockHighlightProps = {
  canvasId: CanvasId;
  id: Id;
  label: string;
  points: string;
};

export function BlockHighlight(
  { canvasId, id, label, points }: BlockHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);
  const [hovered, setHoveredLocal] = useState(false);

  const highlightStyle = getBlockHighlightStyle(selected, hovered);

  return (
    <Highlight
      ariaLabel={label}
      points={points}
      highlightStyle={highlightStyle}
      onFocusChange={(focused) => {
        setHoveredLocal(focused);
        setHovered(focused ? id : null);
      }}
      onHover={(hovering) => {
        setHoveredLocal(hovering);
        setHovered(hovering ? id : null);
      }}
    />
  );
}
