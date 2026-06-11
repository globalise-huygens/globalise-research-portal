import { createContext, RefObject, useContext } from 'react';
import { CanvasId, LazyTiledImage } from './LazyCollectionViewerModel.ts';

type LazyCollectionViewerContextState = {
  lazyCanvases: RefObject<LazyTiledImage[]>;
  loadedCanvases: Set<CanvasId>;
};

export const defaultContext: LazyCollectionViewerContextState = {
  lazyCanvases: { current: [] },
  loadedCanvases: new Set(),
};

export const LazyCollectionViewerContext = createContext<
  LazyCollectionViewerContextState
>(defaultContext);

export function useLazyCollectionViewerContext() {
  return useContext(LazyCollectionViewerContext);
}