import {useEffect} from 'react';
import {useManifest} from '@knaw-huc/osd-iiif-viewer';
import {useLoadPages} from '@globalise/common/document';
import {useLazyCollectionViewerContext} from './LazyCollectionViewerContext';

export function useCollectionAnnotations() {
  const {vault, isReady} = useManifest();
  const loadPages = useLoadPages();
  const context = useLazyCollectionViewerContext();
  const lazyCanvases = context?.lazyCanvases.current ?? [];
  const visibleIndex = context?.selectedCanvas ?? 0;
  const canvasId = lazyCanvases[visibleIndex]?.canvasId;

  useEffect(() => {
    if (!vault || !isReady || !canvasId) {
      return;
    }
    const canvas = vault.get({id: canvasId, type: 'Canvas'});
    const urls = (canvas.annotations ?? [])
      .filter((a: {type: string}) => a.type === 'AnnotationPage')
      .map((a: {id: string}) => a.id);
    if (urls.length) {
      loadPages(canvasId, urls);
    }
  }, [vault, isReady, canvasId, loadPages]);
}