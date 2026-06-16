import { useDocumentStore } from '@globalise/common/document';
import { useEffect, useState } from 'react';

/**
 * Canvas load or render delay = distance to selected canvas * delay in ms
 */
const DELAY = 100;
const RENDER_DISTANCE = 2;
const PRESERVE_DISTANCE = 8;

/**
 * Load and render nearst images first, increase delay according to distance
 *
 * @param index - canvas index
 *
 * @returns {{isLoadable: boolean, isNearViewport: boolean}}
 * - `isLoadable`: Whether the delay has passed and the canvas should start loading.
 * - `isNear`: Whether the canvas is within the allowed maxDistance.
 */
export function useLazyCanvasLifecycle(
  index: number
) {
  const isVisible = useDocumentStore(
    (s) => Math.abs(index - s.selectedCanvas) <= RENDER_DISTANCE,
  );
  const isRendered = useDocumentStore(
    (s) => Math.abs(index - s.selectedCanvas) <= PRESERVE_DISTANCE,
  );

  const [canLoad, setCanLoad] = useState(false);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (canLoad || !isVisible) return;
    const distance = Math.abs(
      index - useDocumentStore.getState().selectedCanvas,
    );
    if (distance === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanLoad(true);
      return;
    }
    const timer = setTimeout(() => setCanLoad(true), distance * DELAY);
    return () => clearTimeout(timer);
  }, [isVisible, canLoad, index]);

  useEffect(() => {
    if (canRender || !isVisible) return;
    const distance = Math.abs(
      index - useDocumentStore.getState().selectedCanvas,
    );
    if (distance === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanRender(true);
      return;
    }
    const timer = setTimeout(() => setCanRender(true), distance * DELAY);
    return () => clearTimeout(timer);
  }, [isVisible, canRender, index]);

  return { canLoad, canRender, isRendered, isVisible };
}