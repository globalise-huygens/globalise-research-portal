import {
  getEntityClassificationId,
  Id,
  isEntity,
} from '@globalise/common/annotation';
import { useDocumentStore } from '@globalise/common/document';
import { useShallow } from 'zustand/react/shallow';

export function useSelectedIdsForCanvas(
  canvasId: string,
): Id[] {
  return useDocumentStore(useShallow((s) => {
    const canvas = s.canvases[canvasId];
    if (!canvas?.annotations) {
      return emptySelection;
    }
    const { entityToWords, wordToBlock, entityToBlock } = canvas.indexes;
    const ids: Id[] = [];
    for (const selectedId of [s.hoveredId, s.clickedId]) {
      if (!selectedId) {
        continue;
      }
      const selectedAnnotation = canvas.annotations[selectedId];
      if (selectedAnnotation && isEntity(selectedAnnotation)) {
        const classificationId = getEntityClassificationId(selectedAnnotation);
        if (
          classificationId === undefined ||
          !s.entityHighlightCategories.has(classificationId)
        ) {
          continue;
        }
      }
      if (selectedId in canvas.annotations) {
        ids.push(selectedId);
      }
      const wordsFromEntity = entityToWords[selectedId];
      if(wordsFromEntity) {
        ids.push(...wordsFromEntity);
      }
      const blockFromWord = wordToBlock[selectedId];
      if (blockFromWord) {
        ids.push(blockFromWord);
      }
      const blockFromEntity = entityToBlock[selectedId];
      if (blockFromEntity) {
        ids.push(blockFromEntity);
      }
    }
    return ids.length ? ids : emptySelection;
  }));
}

const emptySelection: Id[] = [];
