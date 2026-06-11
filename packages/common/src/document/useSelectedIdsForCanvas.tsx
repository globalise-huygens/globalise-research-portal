import {Id} from "@globalise/common/annotation";
import {useDocumentStore} from "@globalise/common/document";
import {useShallow} from "zustand/react/shallow";

export function useSelectedIdsForCanvas(canvasId: string): Id[] {
  return useDocumentStore(useShallow(s => {
    const annotations = s.canvases[canvasId]?.annotations;
    if (!annotations) {
      return emptySelection;
    }
    const {wordToBlock, entityToBlock} = s.indexes;
    const ids: Id[] = [];
    for (const selectedId of [s.hoveredId, s.clickedId]) {
      if (!selectedId) {
        continue;
      }
      if (selectedId in annotations) {
        ids.push(selectedId);
      }
      const blockFromWord = wordToBlock[selectedId];
      if (blockFromWord && blockFromWord in annotations) {
        ids.push(blockFromWord);
      }
      const blockFromEntity = entityToBlock[selectedId];
      if (blockFromEntity && blockFromEntity in annotations) {
        ids.push(blockFromEntity);
      }
    }
    return ids.length ? ids : emptySelection;
  }));
}

const emptySelection: Id[] = [];