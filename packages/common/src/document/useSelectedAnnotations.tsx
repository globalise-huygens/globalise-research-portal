import { Id, isEntity, isHighlightedEntity } from '../annotation';
import { DocumentState, useDocumentStore } from './DocumentStore';
import { CanvasId } from './ManifestViewerSlice';
import { useShallow } from 'zustand/react/shallow';

export type SelectedAnnotations = {
  hoveredId: Id | null;
  clickedId: Id | null;
};

export function getSelectedAnnotations(
  s: DocumentState,
  canvasId: CanvasId,
): SelectedAnnotations {
  return {
    hoveredId: getSelectableId(s, canvasId, s.hoveredId),
    clickedId: getSelectableId(s, canvasId, s.clickedId),
  };
}

function getSelectableId(
  s: DocumentState,
  canvasId: CanvasId,
  id: Id | null,
): Id | null {
  if (!id) {
    return null;
  }
  const annotation = s.canvases[canvasId]?.annotations?.[id];
  if (!annotation) {
    return null;
  }
  if (
    isEntity(annotation) &&
    !isHighlightedEntity(annotation, s.entityHighlightCategories)
  ) {
    return null;
  }
  return id;
}

export function useSelectedAnnotations(
  canvasId: CanvasId,
): SelectedAnnotations {
  return useDocumentStore(
    useShallow((s) => getSelectedAnnotations(s, canvasId)),
  );
}
