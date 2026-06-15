import { RefObject, useEffect } from 'react';
import { useDocumentStore } from '@globalise/common/document';

export function useScrollToSelectedCanvas(
  scrollRef: RefObject<HTMLDivElement | null>,
  canvasListRef: RefObject<HTMLDivElement | null>,
  containerWidth: number,
) {
  const selectedCanvas = useDocumentStore((s) => s.selectedCanvas);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;

    if (!scrollContainer || !canvasList || !containerWidth) {
      return;
    }

    const child = canvasList.children[selectedCanvas];

    if (child instanceof HTMLElement && !isCentered(scrollContainer, child)) {
      child.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, [selectedCanvas, containerWidth, scrollRef, canvasListRef]);
}

export function isCentered(container: HTMLElement, element: HTMLElement): boolean {
  const scrollTop = container.scrollTop;
  const clientHeight = container.clientHeight;
  const scrollCenter = scrollTop + clientHeight / 2;

  const elementTop = element.offsetTop;
  const elementBottom = element.offsetTop + element.offsetHeight;

  return elementTop < scrollCenter && elementBottom > scrollCenter;
}