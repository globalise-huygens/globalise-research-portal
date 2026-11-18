import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { findWordsByOffsets, type Id } from '../annotation';
import { useDocumentStore } from './DocumentStore';
import { type CanvasId, useCanvasIndexes } from './ManifestViewerSlice';
import {
  findActiveCanvasSearchHits,
  type HtrHit,
  useActiveCanvasSearchHits,
  useCanvasSearchHits,
} from './SearchHitSlice';

export function useSearchHitWordsInFacsimile(canvasId: CanvasId): ReadonlySet<Id> {
  return useHitWords(canvasId, useCanvasSearchHits(canvasId));
}

export function useActiveHitWordsInFacsimile(canvasId: CanvasId): ReadonlySet<Id> {
  return useHitWords(canvasId, useActiveCanvasSearchHits(canvasId));
}

export function useActiveHitAnnotationsInDiplomatic(canvasId: CanvasId): Id[] {
  const hits = useActiveCanvasSearchHits(canvasId);
  return useMemo(() => hits.map((hit) => hit.id), [hits]);
}

export function useActiveHitAnnotationsInLineByLine(
  canvasId: CanvasId,
  ids: ReadonlySet<Id>,
): Id[] {
  return useDocumentStore(useShallow((s) =>
    findActiveCanvasSearchHits(s, canvasId)
      .map((hit) => hit.id)
      .filter((id) => ids.has(id))));
}

function useHitWords(canvasId: CanvasId, hits: HtrHit[]): ReadonlySet<Id> {
  const { wordOffsets } = useCanvasIndexes(canvasId);
  return useMemo(
    () => new Set(hits.flatMap((hit) => findWordsByOffsets(wordOffsets, hit))),
    [wordOffsets, hits],
  );
}
