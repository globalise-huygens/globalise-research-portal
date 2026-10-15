import { memo, useMemo } from 'react';
import { Rect } from 'openseadragon';
import { CanvasOverlay } from './CanvasOverlay.tsx';
import type { CanvasDocuments } from '@globalise/metadata';
import { LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { CanvasHeaderLabel } from '../CanvasHeaderLabel.tsx';
import '../CanvasLabel.css';

type Props = {
  lazyCanvas: LazyTiledImage;
  canvasDocuments?: CanvasDocuments;
  isCurrent: boolean;
};

export const CanvasLabelsOverlay = memo(function CanvasLabelsOverlay(
  { lazyCanvas, canvasDocuments, isCurrent }: Props,
) {
  const location = useMemo(
    () => new Rect(0, lazyCanvas.y, 1, lazyCanvas.height),
    [lazyCanvas.y, lazyCanvas.height],
  );
  if (!isCurrent && !canvasDocuments?.starting.length) {
    return null;
  }

  return (
    <CanvasOverlay location={location}>
      <div className="canvas-labels-overlay">
        <CanvasHeaderLabel
          canvasId={lazyCanvas.canvasId}
          isCurrent={isCurrent}
        />
      </div>
    </CanvasOverlay>
  );
});
