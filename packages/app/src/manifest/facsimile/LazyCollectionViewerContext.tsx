import {createContext, RefObject, useContext} from "react";
import {LazyTiledImage} from "./LazyCollectionViewerModel.ts";

type LazyCollectionViewerContextState = {
  lazyCanvases: RefObject<LazyTiledImage[]>;
  selectedCanvas: number;
};

export const LazyCollectionViewerContext = createContext<
  LazyCollectionViewerContextState | null
>(null)

export function useLazyCollectionViewerContext() {
  return useContext(LazyCollectionViewerContext);
}

