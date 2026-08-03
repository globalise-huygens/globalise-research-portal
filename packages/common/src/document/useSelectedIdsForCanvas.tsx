import {
  getEntityClassifiedAsClassName,
  Id,
  isEntity,
} from '@globalise/common/annotation';
import { useDocumentStore } from '@globalise/common/document';
import { useShallow } from 'zustand/react/shallow';
import { useAnnotations } from './useAnnotations';
import { useCanvasIndexes } from './CanvasIndexesSlice';

export function useSelectedIdsForCanvas(
  canvasId: string,
): Id[] {
  const annotations = useAnnotations(canvasId);
  const {
    entityToWords,
    wordToBlock,
    entityToBlock,
    searchToWords,
    searchToBlock,
  } = useCanvasIndexes(canvasId);

  return useDocumentStore(useShallow((s) => {
    if (!Object.keys(annotations).length) {
      return emptySelection;
    }
    const ids: Id[] = [];
    for (const selectedId of [s.hoveredId, s.clickedId]) {
      if (!selectedId) {
        continue;
      }
      const selectedAnnotation = annotations[selectedId];
      if (
        selectedAnnotation &&
        isEntity(selectedAnnotation) &&
        !s.entityHighlightCategories.has(
          getEntityClassifiedAsClassName(selectedAnnotation),
        )
      ) {
        continue;
      }
      if (selectedId in annotations) {
        ids.push(selectedId);
      }
      const wordsFromEntity = entityToWords[selectedId];
      if(wordsFromEntity) {
        ids.push(...wordsFromEntity);
      }
      const wordsFromSearch = searchToWords[selectedId];
      if (wordsFromSearch) {
        ids.push(...wordsFromSearch);
      }
      const blockFromWord = wordToBlock[selectedId];
      if (blockFromWord) {
        ids.push(blockFromWord);
      }
      const blockFromEntity = entityToBlock[selectedId];
      if (blockFromEntity) {
        ids.push(blockFromEntity);
      }
      const blockFromSearch = searchToBlock[selectedId];
      if (blockFromSearch) {
        ids.push(blockFromSearch);
      }
    }
    return ids.length ? ids : emptySelection;
  }));
}

const emptySelection: Id[] = [];
