import { canvasName } from '@globalise/common/annotation';
import type { CanvasDocuments } from '@globalise/metadata';
import { ChipDocument } from './ChipDocument.tsx';
import './CanvasChip.css';
import './CanvasLabel.css';

type Props = {
  canvasId?: string;
  canvasDocuments?: CanvasDocuments;
  isCurrent?: boolean;
};

export function CanvasLabel({ canvasId, canvasDocuments, isCurrent = false }: Props) {
  const { documents = [], starting = [] } = canvasDocuments ?? {};
  const continuing = documents.filter((document) => !starting.includes(document));

  return (
    <span className="canvas-chip-bar canvas-label-bar">
      <span
        aria-current={isCurrent ? 'true' : undefined}
        className="canvas-chip canvas-label"
      >
        {starting.map((document) => (
          <ChipDocument key={document.id} document={document} isEdge/>
        ))}
        {continuing.map((document) => (
          <ChipDocument key={document.id} document={document}/>
        ))}
        <span className="scan">
          <span className="prefix">Scan</span>
          {canvasName(canvasId)}
        </span>
      </span>
    </span>
  );
}
