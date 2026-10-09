import { useMemo } from 'react';
import { Id } from '../annotation';
import { DocumentState, useDocumentStore } from './DocumentStore';
import { CanvasId } from './ManifestViewerSlice';
import { Selection } from './Selection';

export function useIsSelectedInFacsimile(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => getAllIdsFromCanvasSelection(s, canvasId).includes(id));
}

export function useIsSelectedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) => getAllIdsFromCanvasSelection(s, canvasId).includes(id));
}

export function useIsClickedInLineByLine(
  canvasId: CanvasId,
  id: Id,
): boolean {
  return useDocumentStore((s) =>
    getIdsFromSelection(getCanvasSelection(s, canvasId, s.clicked)).includes(id));
}

export function useSelectedAnnotationsInFacsimile(
  canvasId: CanvasId,
): ReadonlySet<Id> {
  const { hovered, clicked } = useCanvasSelection(canvasId);
  return useMemo(
    () => new Set([...getIdsFromSelection(hovered), ...getIdsFromSelection(clicked)]),
    [hovered, clicked],
  );
}

export function useSelectedAnnotationsInDiplomatic(canvasId: CanvasId): Id[] {
  const { hovered, clicked } = useCanvasSelection(canvasId);
  return useMemo(
    () => [...getIdsFromSelection(hovered), ...getIdsFromSelection(clicked)],
    [hovered, clicked],
  );
}

function useCanvasSelection(canvasId: CanvasId) {
  const hovered = useDocumentStore((s) => getCanvasSelection(s, canvasId, s.hovered));
  const clicked = useDocumentStore((s) => getCanvasSelection(s, canvasId, s.clicked));
  return { hovered, clicked };
}

function getAllIdsFromCanvasSelection(
  state: DocumentState,
  canvasId: CanvasId,
): Id[] {
  return [
    ...getIdsFromSelection(getCanvasSelection(state, canvasId, state.hovered)),
    ...getIdsFromSelection(getCanvasSelection(state, canvasId, state.clicked)),
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

function getIdsFromSelection(
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
