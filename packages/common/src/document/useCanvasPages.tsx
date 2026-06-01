import {useEffect, useRef, useState} from 'react';
import {useCanvas, useManifest} from '@knaw-huc/osd-iiif-viewer';
import {Id} from '@globalise/common/annotation';
import {
  useLoadCanvas,
  setSelectedCanvas,
  useIsCanvasInit,
} from '@globalise/common/document';

/**
 * WIP. TODO: Remove refs
 * @param canvasId
 * @param onPageChange
 */
export function useCanvasPages(
  canvasId: string | undefined,
  onPageChange: (id: Id) => void,
) {
  const {current, goTo, currentIndex} = useCanvas();
  const [isInit, setInit] = useState(false);
  const {vault, url, isReady} = useManifest();
  const loadPages = useLoadCanvas();
  const isCanvasInit = useIsCanvasInit(current?.id);

  const currentCanvasId = useRef(canvasId);

  useEffect(() => {
    currentCanvasId.current = canvasId;
  }, [canvasId]);

  const isCanvasShown = useRef(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const manifest = vault.get({id: url, type: 'Manifest'});
    const canvases = vault.get(manifest.items);
    let targetIndex = -1;
    if (canvasId) {
      targetIndex = canvases.findIndex(c => c.id === canvasId);
    } else if (canvases.length > 0) {
      targetIndex = 0;
    }
    if (targetIndex >= 0 && targetIndex !== currentIndex) {
      goTo(targetIndex);
    }
    setInit(true);
  }, [isReady, url, vault, canvasId, isInit, goTo]);

  useEffect(() => {
    if (!current) {
      return;
    }
    if (!isCanvasInit) {
      return;
    }
    setSelectedCanvas(currentIndex);
    const urls = current.annotations
      .filter(a => a.type === 'AnnotationPage')
      .map(a => a.id);
    loadPages(current.id, urls);
    if (current.id === currentCanvasId.current) {
      isCanvasShown.current = true;
      return;
    }
    if (!currentCanvasId.current) {
      isCanvasShown.current = true;
      onPageChange(current.id);
      return;
    }
    if (isCanvasShown.current) {
      onPageChange(current.id);
    }
  }, [current, isCanvasInit]);

  return isInit;
}