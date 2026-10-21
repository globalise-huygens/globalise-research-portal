import { LazyCollectionViewer } from './LazyCollectionViewer.tsx';
import { CanvasOverlays } from './CanvasOverlays.tsx';
import React from 'react';
import type { CanvasId } from '@globalise/common/document';

type Props = {
  initialCanvasId?: CanvasId;
  onCanvasChange: (canvasId: CanvasId) => void;
};

export function ManifestFacsimileViewer(
  { initialCanvasId, onCanvasChange }: Props,
) {
  return <>
    <LazyCollectionViewer
      scanHeight={0.25}
      initialCanvasId={initialCanvasId}
      onCanvasChange={onCanvasChange}
    >
      <CanvasOverlays/>
    </LazyCollectionViewer>
  </>;
}