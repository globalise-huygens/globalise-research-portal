import { useSelectedCanvas, useSelectedCanvasIndex } from '@globalise/common/document';
import { isCentered } from '@globalise/common';
import { RefObject, useEffect } from 'react';

export function useScrollToTranscription(
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
    selectedCanvasSource,
    selectedCanvas,
    containerWidth,
    scrollRef,
    canvasListRef,
  ]);
}
