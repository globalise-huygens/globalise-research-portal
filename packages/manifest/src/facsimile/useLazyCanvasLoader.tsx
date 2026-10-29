import { useEffect } from 'react';
import { Viewer } from 'openseadragon';
import { CanvasId, LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { LazyCanvasTileLoader } from './LazyCanvasTileLoader.ts';

type Props = {
  viewer: Viewer | null;
  lazyCanvases: LazyTiledImage[];
  initialCanvas: number;
  canvasHeight: number;
  onLoadedChange: (loadedIds: Set<CanvasId>) => void;
};

export function useLazyCanvasLoader(
  {
    viewer,
    lazyCanvases,
    initialCanvas,
    canvasHeight,
    onLoadedChange,
  }: Props,
) {
  useEffect(() => {
    if (!viewer || !lazyCanvases.length) {
      return;
    }
    const canvas = lazyCanvases[initialCanvas] ?? lazyCanvases[0];
    // Fill the phone's reading area while keeping the entire scan width visible.
    const initialHeight = window.matchMedia('(max-width: 767px)').matches
      ? Math.min(0.8, canvas.height * viewer.viewport.getAspectRatio() / 1.1)
      : canvasHeight;
    const loader = new LazyCanvasTileLoader(
      viewer,
      lazyCanvases,
      {
        initialCanvas,
        canvasHeight: initialHeight,
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
  ]);
}