import { LazyCollectionViewer } from './LazyCollectionViewer.tsx';
import { CanvasOverlays } from './CanvasOverlays.tsx';
import React from 'react';
import { useCanvasDocuments } from '@globalise/metadata';
import type { CanvasId } from '@globalise/common/document';

type Props = {
  initialCanvasId?: CanvasId;
  onCanvasChange: (canvasId: CanvasId) => void;
};

export function ManifestFacsimileViewer(
  { initialCanvasId, onCanvasChange }: Props,
) {
  const canvasDocuments = useCanvasDocuments();
  return <>
    <LazyCollectionViewer
      scanHeight={0.25}
      canvasDocuments={canvasDocuments}
      initialCanvasId={initialCanvasId}
      onCanvasChange={onCanvasChange}
    >
      <CanvasOverlays canvasDocuments={canvasDocuments}/>
    </LazyCollectionViewer>
  </>;
}