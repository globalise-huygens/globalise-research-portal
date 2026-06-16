import {useCanvasId, useDocumentStore} from '@globalise/common/document';
import {useEffect, useState} from 'react';
import {canvasName, traceCanvas} from "@globalise/common/annotation";

/**
 * Canvas load or render delay = distance to selected canvas * delay in ms
 */
const DELAY = 100;
const MAX_VISIBLE_DISTANCE = 2;
const MAX_RENDER_DISTANCE = 8;

/**
 * Load and render nearst images first, with added delay according to distance
 */
export function useLazyCanvasLifecycle(
  canvasIndex: number
): {
  canLoadNow: boolean,
  canRenderNow: boolean,
  isInRenderRange: boolean,
  isInVisibleRange: boolean
} {
  const id = useCanvasId(canvasIndex)
  const isInVisibleRange = useDocumentStore(
    (s) => Math.abs(canvasIndex - s.selectedCanvas) <= MAX_VISIBLE_DISTANCE,
  );
  const isInRenderRange = useDocumentStore(
    (s) => Math.abs(canvasIndex - s.selectedCanvas) <= MAX_RENDER_DISTANCE,
  );

  const [canLoadNow, setCanLoadNow] = useState(false);
  const [canRenderNow, setCanRenderNow] = useState(false);

  useEffect(() => {
    if (canLoadNow || !isInVisibleRange) {
      return;
    }
    const distance = Math.abs(
      canvasIndex - useDocumentStore.getState().selectedCanvas,
    );
    if (distance === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanLoadNow(true);
      return;
    }
    const timer = setTimeout(() => {
      setCanLoadNow(true);
    }, distance * DELAY);
    return () => clearTimeout(timer);
  }, [isInVisibleRange, canLoadNow, canvasIndex]);

  useEffect(() => {
    if (canRenderNow || !isInVisibleRange) {
      return;
    }
    const distance = Math.abs(
      canvasIndex - useDocumentStore.getState().selectedCanvas,
    );
    if (distance === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanRenderNow(true);
      return;
    }
    const timer = setTimeout(() => {
      setCanRenderNow(true);
    }, distance * DELAY);
    return () => clearTimeout(timer);
  }, [isInVisibleRange, canRenderNow, canvasIndex]);

  useEffect(() => traceCanvas(id, `canLoadNow=${canLoadNow}`), [canLoadNow])
  useEffect(() => traceCanvas(id, `canRenderNow=${canRenderNow}`), [canRenderNow])
  useEffect(() => traceCanvas(id, `isInRenderRange=${isInRenderRange}`), [isInRenderRange])
  useEffect(() => traceCanvas(id, `isInVisibleRange=${isInVisibleRange}`), [isInVisibleRange])

  return {canLoadNow, canRenderNow, isInRenderRange, isInVisibleRange};
}