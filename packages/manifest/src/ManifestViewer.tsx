'use client';

import type { ReactNode } from 'react';
import { type CanvasId, setSelectedCanvas } from '@globalise/common/document';
import { useInitCanvases } from '@globalise/common/document/browser';
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
  const isInitCanvases = useInitCanvases(initialCanvasId);

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
