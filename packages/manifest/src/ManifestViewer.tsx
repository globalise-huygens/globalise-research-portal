'use client';

import { type ReactNode, useState } from 'react';
import { type CanvasId, setSelectedCanvas } from '@globalise/common/document';
import { ManifestCanvasNavigation, ManifestLayout, type ErrorMessage } from './layout';
import { ManifestFacsimileViewer } from './facsimile/ManifestFacsimileViewer';
import { ManifestTranscriptionViewer } from './transcription/ManifestTranscriptionViewer';

export type ManifestViewerProps = {
  initialCanvasId?: CanvasId;
  topLeft?: ReactNode;
  error?: ErrorMessage;
  onClose?: () => void;
};

export function ManifestViewer({ initialCanvasId, topLeft, error, onClose }: ManifestViewerProps) {
  const [startCanvasId] = useState(initialCanvasId);

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
