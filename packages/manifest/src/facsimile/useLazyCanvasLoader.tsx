import { useLayoutEffect, useRef } from 'react';
import { Viewer } from 'openseadragon';
import { CanvasId, LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { LazyCanvasTileLoader } from './LazyCanvasTileLoader.ts';

type Props = {
  viewer: Viewer | null;
  lazyCanvases: LazyTiledImage[];
  baseCanvases: LazyTiledImage[];
  initialCanvas: number;
  canvasHeight: number;
  onLoadedChange: (loadedIds: Set<CanvasId>) => void;
};

export function useLazyCanvasLoader(
  {
    viewer,
    lazyCanvases,
    baseCanvases,
    initialCanvas,
    canvasHeight,
    onLoadedChange,
  }: Props,
) {
  const loaderRef = useRef<LazyCanvasTileLoader | null>(null);

  useLayoutEffect(() => {
    if (!viewer || !lazyCanvases.length) {
      return;
    }
    const loader = new LazyCanvasTileLoader(
      viewer,
      lazyCanvases,
      {
        initialCanvas,
        canvasHeight,
        onLoadedChange,
      },
    );
    loaderRef.current = loader;
    return () => {
      loaderRef.current = null;
      loader.close();
    };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    viewer,
    baseCanvases,
    initialCanvas,
    canvasHeight,
  ]);

  useLayoutEffect(() => {
    loaderRef.current?.setCanvases(lazyCanvases);
  }, [lazyCanvases]);
}
