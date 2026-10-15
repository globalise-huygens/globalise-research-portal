import { useSelectedCanvas } from '@globalise/common/document';
import { isCentered } from '@globalise/common';
import { RefObject, useEffect } from 'react';

export function useScrollToTranscription(
  scrollRef: RefObject<HTMLDivElement | null>,
  canvasListRef: RefObject<HTMLDivElement | null>,
  containerWidth: number,
  selectedIndex: number,
) {
  const { selectedCanvasSource } = useSelectedCanvas();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const canvasList = canvasListRef.current;

    if (!scrollContainer || !canvasList || !containerWidth || selectedIndex === -1) {
      return;
    }
    if (selectedCanvasSource === 'transcription') {
      return;
    }

    const child = canvasList.children[selectedIndex];
    if (child instanceof HTMLElement && !isCentered(scrollContainer, child)) {
      child.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, [selectedIndex, containerWidth, scrollRef, canvasListRef]);
}