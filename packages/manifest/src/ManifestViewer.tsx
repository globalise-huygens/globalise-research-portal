import type { ReactNode } from 'react';
import { type CanvasId, type DocumentHit, setSelectedCanvas } from '@globalise/common/document';
import { useDocumentHitCanvasId } from '@globalise/common/document/browser';
import { ManifestLayout } from './layout/ManifestLayout';
import { ManifestCanvasNavigation } from './layout/ManifestCanvasNavigation';
import { ManifestFacsimileViewer } from './facsimile/ManifestFacsimileViewer';
import { ManifestTranscriptionViewer } from './transcription/ManifestTranscriptionViewer';

export type ManifestViewerProps = {
  canvasId?: CanvasId;
  documentHit?: DocumentHit;
  topLeft?: ReactNode;
  onClose?: () => void;
};

export function ManifestViewer({ canvasId, documentHit, topLeft, onClose }: ManifestViewerProps) {
  const documentHitCanvasId = useDocumentHitCanvasId(documentHit);
  const initialCanvasId = canvasId ?? documentHitCanvasId;

  return (
    <ManifestLayout
      onClose={onClose}
      topLeft={topLeft}
      scan={
        <ManifestFacsimileViewer
          initialCanvasId={initialCanvasId}
          onCanvasChange={(id) => setSelectedCanvas(id, 'facsimile')}
        />
      }
      transcription={
        <ManifestTranscriptionViewer
          initialCanvasId={initialCanvasId}
          onCanvasChange={(id) => setSelectedCanvas(id, 'transcription')}
        />
      }
      bottom={<ManifestCanvasNavigation />}
    />
  );
}
