'use client';

import { type ReactNode, useState } from 'react';
import { type CanvasId, type DocumentHit, setSelectedCanvas } from '@globalise/common/document';
import { useDocumentHitCanvasId } from '@globalise/common/document/browser';
import { ManifestCanvasNavigation, ManifestLayout, type ErrorMessage } from './layout';
import { ManifestFacsimileViewer } from './facsimile/ManifestFacsimileViewer';
import { ManifestTranscriptionViewer } from './transcription/ManifestTranscriptionViewer';

export type ManifestViewerProps = {
  initialCanvasId?: CanvasId;
  documentHit?: DocumentHit;
  topLeft?: ReactNode;
  error?: ErrorMessage;
  onClose?: () => void;
};

export function ManifestViewer({ initialCanvasId, documentHit, topLeft, error, onClose }: ManifestViewerProps) {
  const documentHitCanvasId = useDocumentHitCanvasId(documentHit);
  const [startCanvasId] = useState(initialCanvasId ?? documentHitCanvasId);

  return (
    <ManifestLayout
      onClose={onClose}
      topLeft={topLeft}
      error={error}
      scan={
        <ManifestFacsimileViewer
          initialCanvasId={startCanvasId}
          onCanvasChange={(id) => setSelectedCanvas(id, 'facsimile')}
        />
      }
      transcription={
        <ManifestTranscriptionViewer
          initialCanvasId={startCanvasId}
          onCanvasChange={(id) => setSelectedCanvas(id, 'transcription')}
        />
      }
      bottom={<ManifestCanvasNavigation />}
    />
  );
}
