import { CanvasId, setHovered, useIsSelectedInFacsimile } from '@globalise/common/document';
import { Id } from '@globalise/common/annotation';

type BlockHighlightProps = {
  canvasId: CanvasId;
  id: Id;
  points: string;
};

export function BlockHighlight(
  { canvasId, id, points }: BlockHighlightProps,
) {
  const selected = useIsSelectedInFacsimile(canvasId, id);

  return (
    <g
      className="layout-element"
      data-selected={selected ? 'true' : 'false'}
      onMouseEnter={() => { setHovered(id); }}
      onMouseLeave={() => { setHovered(null); }}
    >
      <polygon className="layout-element-halo" points={points} />
      <polygon className="layout-element-shape" points={points} />
    </g>
  );
}
