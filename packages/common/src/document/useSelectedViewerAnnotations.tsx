import { useMemo } from 'react';
import { Id } from '../annotation';
import { AnnotationIndexes } from '../annotation';
import { CanvasId, useCanvasIndexes } from './ManifestViewerSlice';
import { useSelectedAnnotations } from './useSelectedAnnotations.tsx';

type EntitySelection = 'entity' | 'words';

export type SelectedViewerAnnotations = {
  hovered: Id[];
  clicked: Id[];
  all: Id[];
};

export function useSelectedAnnotationsInDiplomatic(
  canvasId: CanvasId,
): SelectedViewerAnnotations {
  return useSelectedViewerAnnotations(canvasId, 'words');
}

export function useSelectedAnnotationsInFacsimile(
  canvasId: CanvasId,
): SelectedViewerAnnotations {
  return useSelectedViewerAnnotations(canvasId, 'words');
}

export function useIsSelectedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useSelectedViewerAnnotations(canvasId, 'entity').all.includes(id);
}

export function useIsClickedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useSelectedViewerAnnotations(canvasId, 'entity').clicked.includes(id);
}

export function useIsSelectedInFacsimile(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useSelectedViewerAnnotations(canvasId, 'words').all.includes(id);
}

function useSelectedViewerAnnotations(
  canvasId: CanvasId,
  entitySelection: EntitySelection,
): SelectedViewerAnnotations {
  const { hoveredId, clickedId } = useSelectedAnnotations(canvasId);
  const indexes = useCanvasIndexes(canvasId);

  return useMemo(() => {
    const hovered = expandSelection(hoveredId, indexes, entitySelection);
    const clicked = expandSelection(clickedId, indexes, entitySelection);
    return { hovered, clicked, all: [...hovered, ...clicked] };
  }, [hoveredId, clickedId, indexes, entitySelection]);
}

function expandSelection(
  id: Id | null,
  indexes: AnnotationIndexes,
  entitySelection: EntitySelection,
): Id[] {
  if (!id) {
    return [];
  }
  const { entityToWords, entityToBlock, wordToBlock } = indexes;
  const ids: Id[] = [id];

  if (entitySelection === 'words') {
    const wordsFromEntity = entityToWords[id];
    if (wordsFromEntity) {
      ids.push(...wordsFromEntity);
    }
  }
  const blockFromWord = wordToBlock[id];
  if (blockFromWord) {
    ids.push(blockFromWord);
  }
  const blockFromEntity = entityToBlock[id];
  if (blockFromEntity) {
    ids.push(blockFromEntity);
  }
  return ids;
}