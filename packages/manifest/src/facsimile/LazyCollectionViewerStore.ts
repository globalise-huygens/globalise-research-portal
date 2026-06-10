import {create} from 'zustand';
import {CanvasId, LazyTiledImage} from './LazyCollectionViewerModel.ts';

export type LazyCollectionViewerState = {
  lazyCanvases: LazyTiledImage[];
  loaded: Set<CanvasId>;
  setLazyCanvases: (lazyCanvases: LazyTiledImage[]) => void;
  setLoaded: (loaded: Set<CanvasId>) => void;
};

export const lazyCollectionViewerStore = create<LazyCollectionViewerState>(
  (set) => ({
    lazyCanvases: [],
    loaded: new Set(),
    setLazyCanvases: (lazyCanvases) => set({lazyCanvases, loaded: new Set()}),
    setLoaded: (loaded) => set({loaded}),
  })
);