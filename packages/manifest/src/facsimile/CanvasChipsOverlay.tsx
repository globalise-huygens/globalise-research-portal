import { memo, useMemo } from 'react';
import { Rect } from 'openseadragon';
import { Overlay } from '@knaw-huc/osd-iiif-viewer';
import type { CanvasDocuments } from '@globalise/metadata';
import { LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { DocumentEndings } from '../DocumentEndings.tsx';
import { CanvasLabel } from '../CanvasLabel.tsx';

type Props = {
  lazyCanvas: LazyTiledImage;
  canvasDocuments?: CanvasDocuments;
  isCurrent: boolean;
};

export const CanvasChipsOverlay = memo(function CanvasChipsOverlay(
  { lazyCanvas, canvasDocuments, isCurrent }: Props,
) {
  const location = useMemo(
    () => new Rect(0, lazyCanvas.y, 1, lazyCanvas.height),
    [lazyCanvas.y, lazyCanvas.height],
  );
  const hasLabel = isCurrent || !!canvasDocuments?.starting.length;

  if (!hasLabel && !canvasDocuments?.ending.length) {
    return null;
  }

  return (
    <Overlay location={location}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        {hasLabel && (
          <CanvasLabel
            canvasId={lazyCanvas.canvasId}
            canvasDocuments={canvasDocuments}
            isCurrent={isCurrent}
          />
        )}
        <DocumentEndings canvasDocuments={canvasDocuments} isCurrent={isCurrent}/>
      </div>
    </Overlay>
  );
});
