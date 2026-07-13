import React, { useCallback, useRef, useState } from 'react';
import { setPaneRatio } from '../SettingsStore';
import { type Direction } from './useLayoutDirection';

const minPaneRatio = 0.2;
const keyboardStep = 0.05;

type UsePaneResizeProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  direction: Direction;
  dividerSize: number;
  paneRatio: number;
};

function clampPaneRatio(ratio: number) {
  return Math.min(Math.max(ratio, minPaneRatio), 1 - minPaneRatio);
}

export function usePaneResize({
  containerRef,
  direction,
  dividerSize,
  paneRatio,
}: UsePaneResizeProps) {
  const clampedPaneRatio = clampPaneRatio(paneRatio);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const pendingRatioRef = useRef(clampedPaneRatio);
  const liveRatio = dragRatio ?? clampedPaneRatio;

  const updatePaneRatio = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const offset =
        direction === 'horizontal' ? clientX - rect.left : clientY - rect.top;
      const containerSize =
        direction === 'horizontal' ? rect.width : rect.height;
      const availableSize = containerSize - dividerSize;
      if (availableSize <= 0) {
        return;
      }

      const nextRatio = clampPaneRatio(
        (offset - dividerSize / 2) / availableSize,
      );
      pendingRatioRef.current = nextRatio;
      setDragRatio(nextRatio);
    },
    [containerRef, direction, dividerSize],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      activePointerIdRef.current = event.pointerId;
      pendingRatioRef.current = liveRatio;
      event.currentTarget.setPointerCapture(event.pointerId);
      updatePaneRatio(event.clientX, event.clientY);
    },
    [liveRatio, updatePaneRatio],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }
      updatePaneRatio(event.clientX, event.clientY);
    },
    [updatePaneRatio],
  );

  const finishPointerResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }
      activePointerIdRef.current = null;
      setPaneRatio(pendingRatioRef.current);
      setDragRatio(null);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const decreaseKey = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const increaseKey = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      let nextRatio: number | null = null;

      if (event.key === decreaseKey) {
        nextRatio = clampedPaneRatio - keyboardStep;
      } else if (event.key === increaseKey) {
        nextRatio = clampedPaneRatio + keyboardStep;
      } else if (event.key === 'Home') {
        nextRatio = minPaneRatio;
      } else if (event.key === 'End') {
        nextRatio = 1 - minPaneRatio;
      }

      if (nextRatio !== null) {
        event.preventDefault();
        setPaneRatio(clampPaneRatio(nextRatio));
      }
    },
    [clampedPaneRatio, direction],
  );

  const resetDragRatio = useCallback((ratio: number) => {
    activePointerIdRef.current = null;
    pendingRatioRef.current = ratio;
    setDragRatio(null);
  }, []);

  return {
    handleKeyDown,
    handlePointerCancel: finishPointerResize,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: finishPointerResize,
    isDragging: dragRatio !== null,
    liveRatio,
    resetDragRatio,
  };
}
