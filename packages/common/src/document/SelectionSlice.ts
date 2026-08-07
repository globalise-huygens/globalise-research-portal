import { useDocumentStore, DocumentState } from './DocumentStore';
import { Id } from '../annotation';
import { AnnotationIndexes } from '../annotation/indexAnnotations.ts';
import { CanvasId, emptyAnnotationIndex } from './ManifestViewerSlice';

export type SelectionSlice = {
  hoveredId: Id | null;
  hoveredAt: HoverAnchor | null;
  clickedId: Id | null;
};

export type HoverAnchor = {
  element?: Element;
  x: number;
  y: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export function setHovered(
  id: Id | null,
  anchor?: HoverAnchor,
) {
  const current = useDocumentStore.getState();
  if (current.hoveredId === id) {
    if (!anchor || !current.hoveredAt) {
      return;
    }
  }
  useDocumentStore.setState({
    hoveredId: id,
    hoveredAt: id && anchor ? anchor : null,
  });
}

export function toggleClicked(id: Id) {
  const { clickedId } = useDocumentStore.getState();
  useDocumentStore.setState({
    clickedId: id === clickedId ? null : id,
  });
}

export function clearSelection() {
  useDocumentStore.setState({ hoveredId: null, hoveredAt: null, clickedId: null });
}

/**
 * Select current when it is:
 * - hovered or clicked
 * - block of selected word
 * - block of selected entity
 */
function isSelectedInTranscription(
  currentId: Id,
  selectedId: Id | null,
  indexes: AnnotationIndexes,
): boolean {
  if (!selectedId) {
    return false;
  }
  if (currentId === selectedId) {
    return true;
  }
  const { entityToBlock, wordToBlock } = indexes;
  if (currentId === wordToBlock[selectedId]) {
    return true;
  }
  if (currentId === entityToBlock[selectedId]) {
    return true;
  }
  return false;
}

/**
 * Select current when it is:
 * - hovered or clicked
 * - block of selected word
 * - block of selected entity
 * - overlapping word of selected entity
 */
function isSelectedInFacsimile(
  currentId: Id,
  selectedId: Id | null,
  indexes: AnnotationIndexes,
): boolean {
  if (!selectedId) {
    return false;
  }
  if (currentId === selectedId) {
    return true;
  }
  const { entityToBlock, entityToWords, wordToBlock } = indexes;
  if (currentId === wordToBlock[selectedId]) {
    return true;
  }
  /**
   * Highlight related words when current is entity:
   */
  const wordIds = entityToWords[selectedId];
  if (wordIds?.includes(currentId)) {
    return true;
  }
  if (currentId === entityToBlock[selectedId]) {
    return true;
  }
  return false;
}

function getCanvasIndexes(s: DocumentState, canvasId: CanvasId): AnnotationIndexes {
  return s.canvases[canvasId]?.indexes ?? emptyAnnotationIndex;
}

export function useIsSelectedInTranscription(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => {
    const indexes = getCanvasIndexes(s, canvasId);
    return isSelectedInTranscription(id, s.hoveredId, indexes)
      || isSelectedInTranscription(id, s.clickedId, indexes);
  });
}

export function useIsSelectedInFacsimile(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => {
    const indexes = getCanvasIndexes(s, canvasId);
    return isSelectedInFacsimile(id, s.hoveredId, indexes)
      || isSelectedInFacsimile(id, s.clickedId, indexes);
  });
}
