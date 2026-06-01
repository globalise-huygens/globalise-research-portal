import {createContext, RefObject, useContext} from "react";
import {LazyTiledImage} from "./LazyCollectionViewerModel.ts";

type LazyCollectionViewerContextState = {
  lazyCanvases: RefObject<LazyTiledImage[]>;
};

export const defaultContext: LazyCollectionViewerContextState = {
  lazyCanvases: {current: []},
}

export const LazyCollectionViewerContext = createContext<
  LazyCollectionViewerContextState
>(defaultContext)

export function useLazyCollectionViewerContext() {
  return useContext(LazyCollectionViewerContext);
}