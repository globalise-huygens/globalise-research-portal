import { canvasName } from '@globalise/common/annotation';
import './ScanLabel.css';

type Props = {
  canvasId?: string;
  isCurrent?: boolean;
};

export function ScanLabel({ canvasId, isCurrent = false }: Props) {
  const name = canvasName(canvasId);
  const number = (/\d+$/u.exec(name)?.[0] ?? name).replace(/^0+(?=\d)/u, '');

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
