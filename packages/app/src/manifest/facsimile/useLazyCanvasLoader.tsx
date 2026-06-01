import {useEffect} from "react";
import {Viewer} from "openseadragon";
import {setSelectedCanvas} from "@globalise/common/document";
import {LazyTiledImage} from "./LazyCollectionViewerModel.ts";
import {LazyCanvasTileLoader} from "./LazyCanvasTileLoader.ts";

type Props = {
  viewer: Viewer | null;
  lazyCanvases: LazyTiledImage[];
  initialCanvas: number;
  canvasHeight: number;
  onCanvasChange?: (index: number) => void;
}

export function useLazyCanvasLoader(
  {
    viewer,
    lazyCanvases,
    initialCanvas,
    canvasHeight,
    onCanvasChange
  }: Props
) {
  useEffect(() => {
    if (!viewer || !lazyCanvases.length) {
      return;
    }
    const loader = new LazyCanvasTileLoader(
      viewer,
      lazyCanvases,
      {
        initialCanvas,
        canvasHeight,
        onCanvasChange: (index) => {
          setSelectedCanvas(index);
          onCanvasChange?.(index);
        }
      }
    );
    return () => {
      loader.destroy();
    };
  }, [
    viewer,
    lazyCanvases,
    initialCanvas,
    canvasHeight
  ]);
}