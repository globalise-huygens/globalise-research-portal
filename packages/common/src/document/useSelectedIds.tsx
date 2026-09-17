import { useMemo } from 'react';
import { Id } from '../annotation';
import { DocumentState, useDocumentStore } from './DocumentStore';
import { CanvasId } from './ManifestViewerSlice';
import {
  EntitySelection,
  isInSelection,
  Selection,
  selectionIds,
} from './Selection';

export function useIsSelectedInFacsimile(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => isSelected(s, canvasId, id, 'words'));
}

export function useIsSelectedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => isSelected(s, canvasId, id, 'entity'));
}

export function useIsClickedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => isInSelection(getCanvasSelection(s, canvasId, s.clicked), id, 'entity'));
}

export function useSelectedIdsInFacsimile(
  canvasId: CanvasId,
): ReadonlySet<Id> {
  const { hovered, clicked } = useCanvasSelection(canvasId);
  return useMemo(
    () => new Set(selectedIds(hovered, clicked, 'words')),
    [hovered, clicked],
  );
}

export function useSelectedIdsInDiplomatic(canvasId: CanvasId): Id[] {
  const { hovered, clicked } = useCanvasSelection(canvasId);
  return useMemo(
    () => selectedIds(hovered, clicked, 'words'),
    [hovered, clicked],
  );
}

function useCanvasSelection(canvasId: CanvasId) {
  const hovered = useDocumentStore((s) => getCanvasSelection(s, canvasId, s.hovered));
  const clicked = useDocumentStore((s) => getCanvasSelection(s, canvasId, s.clicked));
  return { hovered, clicked };
}

function isSelected(
  state: DocumentState,
  canvasId: CanvasId,
  id: Id,
  entitySelection: EntitySelection,
): boolean {
  return isInSelection(getCanvasSelection(state, canvasId, state.hovered), id, entitySelection)
    || isInSelection(getCanvasSelection(state, canvasId, state.clicked), id, entitySelection);
}

/**
 * Return selection when it is on the canvas
 */
function getCanvasSelection(
  state: DocumentState,
  canvasId: CanvasId,
  selection: Selection | null,
): Selection | null {
  if (!selection) {
    return null;
  }
  if (!state.canvases[canvasId]?.annotations?.[selection.id]) {
    return null;
  }
  return selection;
}

function selectedIds(
  hovered: Selection | null,
  clicked: Selection | null,
  entitySelection: EntitySelection,
): Id[] {
  return [
    ...selectionIds(hovered, entitySelection),
    ...selectionIds(clicked, entitySelection),
  ];
}
