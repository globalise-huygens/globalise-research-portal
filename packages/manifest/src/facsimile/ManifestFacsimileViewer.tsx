import { LazyCollectionViewer } from './LazyCollectionViewer.tsx';
import { CanvasOverlays } from './CanvasOverlays.tsx';
import React from 'react';
import type { CanvasId } from '@globalise/common/document';

type Props = {
  onCanvasChange: (canvasId: CanvasId) => void;
};

export function ManifestFacsimileViewer(
  { onCanvasChange }: Props,
) {
  return <>
    <LazyCollectionViewer
      scanHeight={0.25}
      onCanvasChange={onCanvasChange}
    >
      <CanvasOverlays/>
    </LazyCollectionViewer>
  </>;
}