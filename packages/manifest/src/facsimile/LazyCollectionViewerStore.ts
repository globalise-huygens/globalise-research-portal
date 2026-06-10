import {create} from 'zustand';
import {CanvasId, LazyTiledImage} from './LazyCollectionViewerModel.ts';

export type LazyCollectionViewerState = {
  lazyCanvases: LazyTiledImage[];
  loaded: Set<CanvasId>;
  isScrolling: boolean;
  setLazyCanvases: (lazyCanvases: LazyTiledImage[]) => void;
  setLoaded: (loaded: Set<CanvasId>) => void;
  setScrolling: (isScrolling: boolean) => void;
};

export const lazyCollectionViewerStore = create<LazyCollectionViewerState>(
  (set) => ({
    lazyCanvases: [],
    loaded: new Set(),
    isScrolling: false,
    setLazyCanvases: (lazyCanvases) => set({lazyCanvases, loaded: new Set()}),
    setLoaded: (loaded) => set({loaded}),
    setScrolling: (isScrolling) => set({isScrolling}),
  })
);