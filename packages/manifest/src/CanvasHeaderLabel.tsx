import { canvasName } from '@globalise/common/annotation';
import type { CanvasDocuments } from '@globalise/metadata';
import type { CSSProperties } from 'react';
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
  // Reserve room for both the icon and the complete scan number at small widths.
  const style: CSSProperties & { '--compact-label-size': string } = {
    '--compact-label-size': `${90 / (3.5 + scanNumber.length)}cqi`,
  };

  return (
    <span className="canvas-header" style={style}>
      <span className="canvas-header-content">
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
    </span>
  );
}
