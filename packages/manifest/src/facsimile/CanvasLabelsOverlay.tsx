import { memo, useMemo } from 'react';
import { Rect } from 'openseadragon';
import { Overlay } from '@knaw-huc/osd-iiif-viewer';
import { LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { CanvasHeaderLabel } from '../CanvasHeaderLabel.tsx';
import '../CanvasLabel.css';

type Props = {
  lazyCanvas: LazyTiledImage;
  isCurrent: boolean;
};

export const CanvasLabelsOverlay = memo(function CanvasLabelsOverlay(
  { lazyCanvas, isCurrent }: Props,
) {
  const location = useMemo(
    () => new Rect(0, lazyCanvas.y, 1, lazyCanvas.height),
    [lazyCanvas.y, lazyCanvas.height],
  );
  return (
    <Overlay location={location}>
      <div className="canvas-labels-overlay">
        <CanvasHeaderLabel
          canvasId={lazyCanvas.canvasId}
          isCurrent={isCurrent}
        />
      </div>
    </Overlay>
  );
});
