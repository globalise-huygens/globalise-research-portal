import { useEffect } from 'react';
import { Viewer } from 'openseadragon';
import { CanvasId, LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { LazyCanvasTileLoader } from './LazyCanvasTileLoader.ts';
import type { ScanFit } from '../responsive/ReadingLayout';

type Props = {
  viewer: Viewer | null;
  lazyCanvases: LazyTiledImage[];
  initialCanvas: number;
  canvasHeight: number;
  scanFit: ScanFit;
  onLoadedChange: (loadedIds: Set<CanvasId>) => void;
};

export function useLazyCanvasLoader(
  {
    viewer,
    lazyCanvases,
    initialCanvas,
    canvasHeight,
    scanFit,
    onLoadedChange,
  }: Props,
) {
  useEffect(() => {
    if (!viewer || !lazyCanvases.length) {
      return;
    }
    const canvas = lazyCanvases[initialCanvas] ?? lazyCanvases[0];
    const fittedHeight = scanFit === 'width' ? widthFittedHeight(canvas, viewer) : canvasHeight;
    const loader = new LazyCanvasTileLoader(
      viewer,
      lazyCanvases,
      {
        initialCanvas,
        canvasHeight: fittedHeight,
        onLoadedChange,
      },
    );
    return () => {
      loader.close();
    };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    viewer,
    lazyCanvases,
    initialCanvas,
    canvasHeight,
    scanFit,
  ]);
}

const widthFitMargin = 1.1;
const maxWidthFittedHeight = 0.8;

function widthFittedHeight(canvas: LazyTiledImage, viewer: Viewer): number {
  return Math.min(maxWidthFittedHeight, canvas.height * viewer.viewport.getAspectRatio() / widthFitMargin);
}