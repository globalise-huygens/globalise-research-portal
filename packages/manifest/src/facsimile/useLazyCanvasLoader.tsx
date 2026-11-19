import { useLayoutEffect, useRef } from 'react';
import { Viewer } from 'openseadragon';
import { CanvasId, LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { LazyCanvasTileLoader } from './LazyCanvasTileLoader.ts';
import type { ScanFit } from '../responsive/ReadingLayout';

type Props = {
  viewer: Viewer | null;
  lazyCanvases: LazyTiledImage[];
  baseCanvases: LazyTiledImage[];
  initialCanvas: number;
  canvasHeight: number;
  scanFit: ScanFit;
  onLoadedChange: (loadedIds: Set<CanvasId>) => void;
};

export function useLazyCanvasLoader(
  {
    viewer,
    lazyCanvases,
    baseCanvases,
    initialCanvas,
    canvasHeight,
    scanFit,
    onLoadedChange,
  }: Props,
) {
  const loaderRef = useRef<LazyCanvasTileLoader | null>(null);

  useLayoutEffect(() => {
    if (!viewer || !baseCanvases.length) {
      return;
    }
    const canvas = baseCanvases[initialCanvas] ?? baseCanvases[0];
    const fittedHeight = scanFit === 'width' ? widthFittedHeight(canvas, viewer) : canvasHeight;
    const loader = new LazyCanvasTileLoader(
      viewer,
      baseCanvases,
      {
        initialCanvas,
        canvasHeight: fittedHeight,
        onLoadedChange,
      },
    );
    loaderRef.current = loader;
    return () => {
      loaderRef.current = null;
      loader.close();
    };
  }, [viewer, baseCanvases, initialCanvas, canvasHeight, scanFit, onLoadedChange]);

  useLayoutEffect(() => {
    loaderRef.current?.setCanvases(lazyCanvases);
  }, [viewer, baseCanvases, initialCanvas, canvasHeight, scanFit, onLoadedChange, lazyCanvases]);
}

const widthFitMargin = 1.1;
const maxWidthFittedHeight = 0.8;

function widthFittedHeight(canvas: LazyTiledImage, viewer: Viewer): number {
  return Math.min(maxWidthFittedHeight, canvas.height * viewer.viewport.getAspectRatio() / widthFitMargin);
}
