import type { CanvasDocuments } from '@globalise/metadata';
import { ChipDocument } from './ChipDocument.tsx';
import './CanvasChip.css';
import './DocumentEndings.css';

type Props = {
  canvasDocuments?: CanvasDocuments;
  isCurrent?: boolean;
};

export function DocumentEndings({ canvasDocuments, isCurrent = false }: Props) {
  if (!canvasDocuments?.ending.length) {
    return null;
  }
  return (
    <span className="canvas-chip-bar document-endings">
      <span
        aria-current={isCurrent ? 'true' : undefined}
        className="canvas-chip"
      >
        {canvasDocuments.ending.map((document) => (
          <ChipDocument key={document.id} document={document} isEdge/>
        ))}
      </span>
    </span>
  );
}
