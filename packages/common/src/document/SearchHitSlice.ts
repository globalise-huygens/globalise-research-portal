import { useShallow } from 'zustand/react/shallow';
import type { Id } from '../annotation';
import type { DocumentRef } from '../uri';
import { setState, useDocumentStore } from './DocumentStore';
import type { CanvasId } from './ManifestViewerSlice';

export type SearchHitSlice = {
  searchHitRequest: SearchHitRequest | null;
  searchHitQuery: SearchHitQuery | null;
  searchHits: Record<CanvasId, HtrHit[]>;
  activeEsHitIndex: number | null;
};

type LoadedSearchHits = Pick<SearchHitSlice, 'searchHits' | 'activeEsHitIndex'>;

export type SearchHitRequest = {
  document: DocumentRef;
  docEsId: string;
  snippet: string;
};

/**
 * The fulltext search query and facets, as retrieved from the url, to determine the manifest viewer hits
 */
export type SearchHitQuery = {
  query?: string;
  facets: Record<string, string[]>;
};

export type HtrHit = {
  id: Id;
  canvasId: CanvasId;
  start: number;
  end: number;
  esHitIndex: number;
};

export function setSearchHitRequest(searchHitRequest: SearchHitRequest | null) {
  setState({ searchHitRequest });
}

export function setSearchHitQuery(searchQuery: SearchHitQuery | null) {
  setState({ searchHitQuery: searchQuery });
}

export function useSearchHitRequest(): SearchHitRequest | null {
  return useDocumentStore((s) => s.searchHitRequest);
}

export function useSearchHitQuery(): SearchHitQuery | null {
  return useDocumentStore((s) => s.searchHitQuery);
}

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

export function findActiveSearchHits(s: LoadedSearchHits): HtrHit[] {
  return Object.keys(s.searchHits)
    .flatMap((canvasId) => findActiveCanvasSearchHits(s, canvasId));
}

export function findActiveCanvasSearchHits(
  slice: LoadedSearchHits,
  canvasId: CanvasId,
): HtrHit[] {
  return (slice.searchHits[canvasId] ?? noHits)
    .filter((hit) => hit.esHitIndex === slice.activeEsHitIndex);
}
