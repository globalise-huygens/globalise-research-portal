'use client';

import type { ReactNode } from 'react';
import { type CanvasId, setSelectedCanvas } from '@globalise/common/document';
import { ManifestCanvasNavigation, ManifestLayout, type ErrorMessage } from './layout';
import { ManifestFacsimileViewer } from './facsimile/ManifestFacsimileViewer';
import { ManifestTranscriptionViewer } from './transcription/ManifestTranscriptionViewer';

export type ManifestViewerProps = {
  canvasId?: CanvasId;
  topLeft?: ReactNode;
  error?: ErrorMessage;
  onClose?: () => void;
};

export function ManifestViewer({ canvasId, topLeft, error, onClose }: ManifestViewerProps) {
  return (
    <ManifestLayout
      onClose={onClose}
      topLeft={topLeft}
      error={error}
      scan={
        <ManifestFacsimileViewer
          initialCanvasId={canvasId}
          onCanvasChange={(id) => setSelectedCanvas(id, 'facsimile')}
        />
      }
      transcription={
        <ManifestTranscriptionViewer
          initialCanvasId={canvasId}
          onCanvasChange={(id) => setSelectedCanvas(id, 'transcription')}
        />
      }
      bottom={<ManifestCanvasNavigation />}
    />
  );
}
