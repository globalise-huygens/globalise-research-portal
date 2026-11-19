import { canvasName } from '@globalise/common/annotation';
import type { CanvasDocuments } from '@globalise/metadata';
import { DocumentStartPreview } from './DocumentStartPreview.tsx';
import './CanvasLabel.css';

type Props = {
  canvasId?: string;
  canvasDocuments?: CanvasDocuments;
  isCurrent?: boolean;
};

export function CanvasHeaderLabel({ canvasId, canvasDocuments, isCurrent = false }: Props) {
  const starting = canvasDocuments?.starting ?? [];
  const scanNumber = canvasName(canvasId);

  return (
    <span className="canvas-header">
      {starting.length ? (
        <DocumentStartPreview
          documents={starting}
          scanNumber={scanNumber}
          isCurrent={isCurrent}
        />
      ) : null}
      <span
        className="canvas-label scan"
        aria-current={isCurrent ? 'page' : undefined}
      >
        <span className="prefix">Scan</span> {scanNumber}
      </span>
    </span>
  );
}
