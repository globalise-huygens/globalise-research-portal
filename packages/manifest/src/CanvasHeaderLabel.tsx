import { canvasName } from '@globalise/common/annotation';
import './CanvasLabel.css';

type Props = {
  canvasId?: string;
  isCurrent?: boolean;
};

export function CanvasHeaderLabel({ canvasId, isCurrent = false }: Props) {
  return (
    <span className="canvas-header">
      <span
        aria-current={isCurrent ? 'true' : undefined}
        className="canvas-label"
      >
        <span className="scan">
          <span className="prefix">Scan</span>
          {canvasName(canvasId)}
        </span>
      </span>
    </span>
  );
}
