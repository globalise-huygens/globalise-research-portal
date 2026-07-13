import { useSelectedCanvas, useSelectedCanvasIndex } from '@globalise/common/document';
import { RefObject, useEffect } from 'react';

export function useScrollToSelectedCanvas(
  scrollRef: RefObject<HTMLDivElement | null>,
  canvasListRef: RefObject<HTMLDivElement | null>,
  containerWidth: number,
) {
  const { id: selectedCanvasId, selectedCanvasSource } = useSelectedCanvas();
  const selectedCanvas = useSelectedCanvasIndex();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;

    if (!scrollContainer || !canvasList || !containerWidth || selectedCanvas === -1) {
      return;
    }
    if (selectedCanvasSource === 'transcription') {
      return;
    }

    const child = canvasList.children[selectedCanvas];
    if (child instanceof HTMLElement && !isCentered(scrollContainer, child)) {
      child.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, [
    selectedCanvasId,
    selectedCanvas,
    selectedCanvasSource,
    containerWidth,
    scrollRef,
    canvasListRef,
  ]);
}

export function isCentered(container: HTMLElement, element: HTMLElement): boolean {
  const scrollTop = container.scrollTop;
  const clientHeight = container.clientHeight;
  const scrollCenter = scrollTop + clientHeight / 2;

  const elementTop = element.offsetTop;
  const elementBottom = element.offsetTop + element.offsetHeight;

  return elementTop < scrollCenter && elementBottom > scrollCenter;
}
