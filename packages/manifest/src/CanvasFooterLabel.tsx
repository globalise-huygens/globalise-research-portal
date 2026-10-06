import type { CanvasDocuments } from '@globalise/metadata';
import { DocumentsLabel } from './DocumentsLabel.tsx';
import './CanvasLabel.css';

type Props = {
  canvasDocuments?: CanvasDocuments;
  isCurrent?: boolean;
};

export function CanvasFooterLabel({ canvasDocuments, isCurrent = false }: Props) {
  if (!canvasDocuments?.ending.length) {
    return null;
  }
  return (
    <span className="canvas-footer">
      <span
        aria-current={isCurrent ? 'true' : undefined}
        className="canvas-label"
      >
        <DocumentsLabel boundaries={canvasDocuments.ending}/>
      </span>
    </span>
  );
}
