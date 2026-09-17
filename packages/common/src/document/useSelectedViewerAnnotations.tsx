import { useMemo } from 'react';
import { Id } from '../annotation';
import { DocumentState, useDocumentStore } from './DocumentStore';
import { CanvasId } from './ManifestViewerSlice';
import { Selection } from './Selection';

export function useIsSelectedInFacsimile(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => isSelected(s, canvasId).includes(id));
}

export function useIsSelectedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => isSelected(s, canvasId).includes(id));
}

export function useIsClickedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) =>
    getSelectionIds(getCanvasSelection(s, canvasId, s.clicked)).includes(id));
}

export function useSelectedAnnotationsInFacsimile(
  canvasId: CanvasId,
): ReadonlySet<Id> {
  const { hovered, clicked } = useCanvasSelection(canvasId);
  return useMemo(
    () => new Set([...getSelectionIds(hovered), ...getSelectionIds(clicked)]),
    [hovered, clicked],
  );
}

export function useSelectedAnnotationsInDiplomatic(canvasId: CanvasId): Id[] {
  const { hovered, clicked } = useCanvasSelection(canvasId);
  return useMemo(
    () => [...getSelectionIds(hovered), ...getSelectionIds(clicked)],
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
): Id[] {
  return [
    ...getSelectionIds(getCanvasSelection(state, canvasId, state.hovered)),
    ...getSelectionIds(getCanvasSelection(state, canvasId, state.clicked)),
  ];
}

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

function getSelectionIds(
  selection: Selection | null,
): Id[] {
  if (!selection) {
    return [];
  }
  const ids = [selection.id];
  if (selection.type === 'block') {
    return ids;
  }
  if (selection.type === 'entity') {
    ids.push(...selection.words);
  }
  if (selection.block) {
    ids.push(selection.block);
  }
  return ids;
}
