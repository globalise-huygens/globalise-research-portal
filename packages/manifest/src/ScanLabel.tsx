import { canvasName } from '@globalise/common/annotation';
import './ScanLabel.css';

type Props = {
  canvasId?: string;
  isCurrent?: boolean;
};

export function ScanLabel({ canvasId, isCurrent = false }: Props) {
  const number = canvasName(canvasId);

  return (
    <span
      aria-current={isCurrent ? 'true' : undefined}
      className="scan-label"
    >
      <span className="prefix">Scan</span>
      {number}
    </span>
  );
}
