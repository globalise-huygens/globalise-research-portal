'use client';

import type { ReactNode } from 'react';
import { type CanvasId, type DocumentHit, setSelectedCanvas } from '@globalise/common/document';
import { useDocumentHitCanvasId, useInitCanvases } from '@globalise/common/document/browser';
import { ManifestCanvasNavigation, ManifestLayout, type ErrorMessage } from './layout';
import { ManifestFacsimileViewer } from './facsimile/ManifestFacsimileViewer';
import { ManifestTranscriptionViewer } from './transcription/ManifestTranscriptionViewer';

export type ManifestViewerProps = {
  canvasId?: CanvasId;
  documentHit?: DocumentHit;
  topLeft?: ReactNode;
  error?: ErrorMessage;
  onClose?: () => void;
};

export function ManifestViewer({ canvasId, documentHit, topLeft, error, onClose }: ManifestViewerProps) {
  const documentHitCanvasId = useDocumentHitCanvasId(documentHit);
  const isInitCanvases = useInitCanvases(canvasId ?? documentHitCanvasId);

  if (!isInitCanvases) {
    return null;
  }

  return (
    <ManifestLayout
      onClose={onClose}
      topLeft={topLeft}
      error={error}
      scan={<ManifestFacsimileViewer onCanvasChange={(id) => setSelectedCanvas(id, 'facsimile')} />}
      transcription={<ManifestTranscriptionViewer onCanvasChange={(id) => setSelectedCanvas(id, 'transcription')} />}
      bottom={<ManifestCanvasNavigation />}
    />
  );
}
