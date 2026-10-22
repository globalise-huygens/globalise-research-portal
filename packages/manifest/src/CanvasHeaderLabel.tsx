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
    <>
      {starting.length ? (
        <span className="document-start-line">
          <DocumentStartPreview
            documents={starting}
            scanNumber={scanNumber}
            isCurrent={isCurrent}
          />
          <span className="document-start-rule" aria-hidden="true" />
          {starting.length === 1 && (
            <span className="canvas-label document-scan-count">
              {starting[0].scans.length} scan{starting[0].scans.length === 1 ? '' : 's'}
            </span>
          )}
        </span>
      ) : null}
      <span className="canvas-header">
        <span className="canvas-label scan" aria-current={isCurrent ? 'page' : undefined}>
          <span className="prefix">Scan</span> {scanNumber}
        </span>
      </span>
    </>
  );
}
