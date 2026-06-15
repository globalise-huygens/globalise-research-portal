import { lazyCollectionViewerStore } from './LazyCollectionViewerStore.ts';

export function useIsViewerScrolling(): boolean {
  return lazyCollectionViewerStore((s) => s.isScrolling);
}