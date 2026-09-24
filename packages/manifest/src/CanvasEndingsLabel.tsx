import type { CanvasDocuments } from '@globalise/metadata';
import { DocumentsLabel } from './DocumentsLabel.tsx';
import './CanvasLabel.css';

type Props = {
  canvasDocuments?: CanvasDocuments;
  isCurrent?: boolean;
};

export function CanvasEndingsLabel({ canvasDocuments, isCurrent = false }: Props) {
  if (!canvasDocuments?.ending.length) {
    return null;
  }
  return (
    <span className="canvas-label-bar" data-position="bottom">
      <span
        aria-current={isCurrent ? 'true' : undefined}
        className="canvas-label"
      >
        <DocumentsLabel edges={canvasDocuments.ending}/>
      </span>
    </span>
  );
}
