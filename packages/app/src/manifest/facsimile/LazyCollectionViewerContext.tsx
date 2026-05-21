import {createContext, RefObject, useContext} from "react";
import {LazyTiledImage} from "./LazyCollectionViewerModel.ts";

type LazyCollectionViewerContextState = {
  lazyCanvases: RefObject<LazyTiledImage[]>;
  selectedCanvas: number;
};

export const defaultContext: LazyCollectionViewerContextState = {
  lazyCanvases: {current: []},
  selectedCanvas: 0
}
export const LazyCollectionViewerContext = createContext<
  LazyCollectionViewerContextState
>(defaultContext)

export function useLazyCollectionViewerContext() {
  return useContext(LazyCollectionViewerContext);
}

