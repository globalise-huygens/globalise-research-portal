import { canvasName } from '@globalise/common/annotation';
import './CanvasLabel.css';

type Props = {
  canvasId?: string;
  isCurrent?: boolean;
};

export function CanvasLabel({ canvasId, isCurrent = false }: Props) {
  const number = canvasName(canvasId);

  return (
    <span
      aria-current={isCurrent ? 'true' : undefined}
      className="canvas-label"
    >
      <span className="prefix">Scan</span>
      {number}
    </span>
  );
}
