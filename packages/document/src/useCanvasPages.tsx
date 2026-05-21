import {useEffect, useState} from 'react';
import {useCanvas, useManifest} from '@knaw-huc/osd-iiif-viewer';
import {Id} from '@globalise/common/annotation';
import {useLoadCanvas, setSelectedCanvas} from '@globalise/common/document';

export function useCanvasPages(
  canvasId: string | undefined,
  onPageChange: (id: Id) => void,
) {
  const {current, goTo, currentIndex} = useCanvas();
  const [isInit, setInit] = useState(false);
  const {vault, url, isReady} = useManifest();
  const loadPages = useLoadCanvas();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const manifest = vault.get({id: url, type: 'Manifest'});
    const canvases = vault.get(manifest.items);
    if (canvasId) {
      const index = canvases.findIndex(c => c.id === canvasId);
      if (index >= 0) {
        goTo(index);
      }
    } else if (canvases.length > 0) {
      goTo(0);
    }
    setInit(true);
  }, [isReady, url, vault, canvasId, isInit, goTo]);

  useEffect(() => {
    if (!current) {
      return;
    }
    setSelectedCanvas(currentIndex);
    const urls = current.annotations
      .filter(a => a.type === 'AnnotationPage')
      .map(a => a.id);
    loadPages(current.id, urls);
    onPageChange(current.id);
  }, [current]);

  return isInit;
}