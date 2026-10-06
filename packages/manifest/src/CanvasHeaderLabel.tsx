import { canvasName } from '@globalise/common/annotation';
import type { CanvasDocuments } from '@globalise/metadata';
import { DocumentsLabel } from './DocumentsLabel.tsx';
import { Separator } from './Separator.tsx';
import './CanvasLabel.css';

type Props = {
  canvasId?: string;
  canvasDocuments?: CanvasDocuments;
  isCurrent?: boolean;
};

export function CanvasHeaderLabel({ canvasId, canvasDocuments, isCurrent = false }: Props) {
  const { documents = [], starting = [] } = canvasDocuments ?? {};
  const continuing = documents.filter((document) => !starting.includes(document));

  return (
    <span className="canvas-header">
      <span
        aria-current={isCurrent ? 'true' : undefined}
        className="canvas-label"
      >
        <DocumentsLabel edges={starting} others={continuing}/>
        {documents.length > 0 && (
          <Separator isEdge={starting.length > 0}/>
        )}
        <span className="scan">
          <span className="prefix">Scan</span>
          {canvasName(canvasId)}
        </span>
      </span>
    </span>
  );
}
