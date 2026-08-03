import { type AnnotationIndexes } from '../annotation';
import { useDocumentStore, type DocumentState } from './DocumentStore';
import type { CanvasId } from './ManifestViewerSlice';

export type CanvasIndexesSlice = {
  canvasIndexes: Record<CanvasId, AnnotationIndexes>;
};

export const emptyCanvasIndexes: AnnotationIndexes = {
  wordToLine: {},
  lineToBlock: {},
  blockToLines: {},
  wordToBlock: {},
  entityToWords: {},
  entityToBlock: {},
  searchToWords: {},
  searchToBlock: {},
};

export function getCanvasIndexes(
  s: DocumentState,
  canvasId: CanvasId,
): AnnotationIndexes {
  return s.canvasIndexes[canvasId] ?? emptyCanvasIndexes;
}

export function useCanvasIndexes(canvasId: CanvasId): AnnotationIndexes {
  return useDocumentStore((s) => getCanvasIndexes(s, canvasId));
}
