import { Id } from '@globalise/common/annotation';
import { useDocumentStore } from '@globalise/common/document';
import { useShallow } from 'zustand/react/shallow';

export function useSelectedIdsForCanvas(canvasId: string): Id[] {
  return useDocumentStore(useShallow((s) => {
    const canvas = s.canvases[canvasId];
    if (!canvas?.annotations) {
      return emptySelection;
    }
    const { wordToBlock, entityToBlock } = canvas.indexes;
    const ids: Id[] = [];
    for (const selectedId of [s.hoveredId, s.clickedId]) {
      if (!selectedId) {
        continue;
      }
      if (selectedId in canvas.annotations) {
        ids.push(selectedId);
      }
      const blockFromWord = wordToBlock[selectedId];
      if (blockFromWord && blockFromWord in canvas.annotations) {
        ids.push(blockFromWord);
      }
      const blockFromEntity = entityToBlock[selectedId];
      if (blockFromEntity && blockFromEntity in canvas.annotations) {
        ids.push(blockFromEntity);
      }
    }
    return ids.length ? ids : emptySelection;
  }));
}

const emptySelection: Id[] = [];