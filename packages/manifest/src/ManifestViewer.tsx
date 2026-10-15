'use client';

import { type ReactNode, useEffect } from 'react';
import {
  type CanvasId,
  type DocumentHit,
  logCanvasTiming,
  setSelectedCanvas,
} from '@globalise/common/document';
import { useDocumentHitCanvasId } from '@globalise/common/document/browser';
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
  const initialCanvasId = canvasId ?? documentHitCanvasId;

  useEffect(logInitialCanvas, [initialCanvasId, canvasId, documentHitCanvasId]);

  function logInitialCanvas() {
    const source = canvasId ? 'url' : documentHitCanvasId ? 'heuristic' : 'none';
    logCanvasTiming('initial canvas', { initialCanvasId, source });
  }

  return (
    <ManifestLayout
      onClose={onClose}
      topLeft={topLeft}
      error={error}
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
