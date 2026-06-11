import { create } from 'zustand';
import { CanvasId, LazyTiledImage } from './LazyCollectionViewerModel.ts';

export type LazyCollectionViewerState = {
  lazyCanvases: LazyTiledImage[];
  loaded: Set<CanvasId>;
  isScrolling: boolean;
};

export const lazyCollectionViewerStore = create<LazyCollectionViewerState>(
  () => ({
    lazyCanvases: [],
    loaded: new Set(),
    isScrolling: false,
  }),
);

export function setLazyCanvases(lazyCanvases: LazyTiledImage[]) {
  lazyCollectionViewerStore.setState({
    lazyCanvases,
    // Reset loaded when initializing lazy canvases:
    loaded: new Set(),
  });
}

export function setLoaded(loaded: Set<CanvasId>) {
  lazyCollectionViewerStore.setState({ loaded });
}

export function setScrolling(isScrolling: boolean) {
  lazyCollectionViewerStore.setState({ isScrolling });
}