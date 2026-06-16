import {useDocumentStore} from '@globalise/common/document';
import {useEffect, useRef, useState} from 'react';

/**
 * Load nearst images first, increase delay according to distance
 *
 * @param index - canvas index
 * @param delay - total delay = distance * delay (ms)
 * @param maxDistance - maximum distance to be loadable
 *
 * @returns {{isLoadable: boolean, isNearViewport: boolean}}
 * - `isLoadable`: Whether the delay has passed and the canvas should start loading.
 * - `isNear`: Whether the canvas is within the allowed maxDistance.
 */
export function useIsLoadableWithDistanceDelay(
  index: number,
  delay = 100,
  maxDistance = 2,
): { isLoadable: boolean; isNearViewport: boolean } {
  const isNearViewport = useDocumentStore(
    (s) => Math.abs(index - s.selectedCanvas) <= maxDistance,
  );

  const [isLoadable, setIsLoadable] = useState(false);

  useEffect(() => {
    if (isLoadable || !isNearViewport) {
      return;
    }

    const currentSelected = useDocumentStore.getState().selectedCanvas;
    const distance = Math.abs(index - currentSelected);

    if (distance === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadable(true);
      return;
    }

    const timer = setTimeout(() => {

      setIsLoadable(true);
    }, distance * delay);

    return () => clearTimeout(timer);
  }, [isNearViewport, isLoadable, delay, index]);

  return { isLoadable, isNearViewport };
}

export function useIsRenderableWithDistanceDelay(
  index: number,
  delay = 100,
  maxDistance = 2,
): { isRenderable: boolean; isNearViewport: boolean } {
  const isNearViewport = useDocumentStore(
    (s) => Math.abs(index - s.selectedCanvas) <= maxDistance,
  );

  const [isRenderable, setIsRenderable] = useState(false);

  useEffect(() => {
    if (isRenderable || !isNearViewport) {
      return;
    }
    const currentSelected = useDocumentStore.getState().selectedCanvas;
    const distance = Math.abs(index - currentSelected);
    if (distance === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRenderable(true);
      return;
    }
    const timer = setTimeout(() => setIsRenderable(true), distance * delay);
    return () => clearTimeout(timer);
  }, [isNearViewport, isRenderable, delay, index]);

  return { isRenderable, isNearViewport };
}


export function useCanvasVisibility(
  index: number,
  renderDistance = 2,
  preserveDistance = 8,
) {
  const distance = useDocumentStore(
    (s) => Math.abs(index - s.selectedCanvas),
  );

  // Sticky: once mounted, stay mounted until we leave preserveDistance.
  const hasMountedRef = useRef(false);
  const inPreserveRange = distance <= preserveDistance;
  if (inPreserveRange) hasMountedRef.current = true;
  if (!inPreserveRange) hasMountedRef.current = false;

  return {
    shouldRender: hasMountedRef.current,
    isVisible: distance <= renderDistance,
  };
}