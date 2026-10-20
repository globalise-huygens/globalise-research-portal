import { useShallow } from 'zustand/react/shallow';
import type { Id } from '../annotation';
import { setState, useDocumentStore } from './DocumentStore';
import type { CanvasId } from './ManifestViewerSlice';

export type SearchHitSlice = {
  searchHits: Record<CanvasId, HtrHit[]>;
  activeEsHitIndex: number | null;
};

export type HtrHit = {
  id: Id;
  canvasId: CanvasId;
  start: number;
  end: number;
  esHitIndex: number;
};

export function setSearchHits(hits: HtrHit[], activeEsHitIndex: number | null) {
  setState({ searchHits: groupByCanvas(hits), activeEsHitIndex });
}

export function groupByCanvas(hits: HtrHit[]): Record<CanvasId, HtrHit[]> {
  const grouped: Record<CanvasId, HtrHit[]> = {};
  for (const hit of hits) {
    (grouped[hit.canvasId] ??= []).push(hit);
  }
  return grouped;
}

const noHits: HtrHit[] = [];

export function useCanvasSearchHits(canvasId: CanvasId): HtrHit[] {
  return useDocumentStore((s) => s.searchHits[canvasId] ?? noHits);
}

export function useActiveCanvasSearchHits(canvasId: CanvasId): HtrHit[] {
  return useDocumentStore(useShallow((s) => findActiveCanvasSearchHits(s, canvasId)));
}

export function findActiveSearchHits(s: SearchHitSlice): HtrHit[] {
  return Object.keys(s.searchHits)
    .flatMap((canvasId) => findActiveCanvasSearchHits(s, canvasId));
}

export function findActiveCanvasSearchHits(
  slice: SearchHitSlice,
  canvasId: CanvasId,
): HtrHit[] {
  return (slice.searchHits[canvasId] ?? noHits)
    .filter((hit) => hit.esHitIndex === slice.activeEsHitIndex);
}
