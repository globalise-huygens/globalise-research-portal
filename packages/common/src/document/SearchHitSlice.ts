import { useShallow } from 'zustand/react/shallow';
import type { Id } from '../annotation';
import type { DocumentRef } from '../uri';
import { setState, useDocumentStore } from './DocumentStore';
import { type CanvasId, setSelectedCanvas } from './ManifestViewerSlice';

export type SearchHitSlice = {
  searchHitRequest: SearchHitRequest | null;
  searchHitQuery: SearchHitQuery | null;
  hits: HtrHit[];
  searchHits: Record<CanvasId, HtrHit[]>;
  activeHitIndex: number | null;
};

type ActiveSearchHit = Pick<SearchHitSlice, 'hits' | 'activeHitIndex'>;

export type SearchHitRequest = {
  document: DocumentRef;
  hit: SearchHitRef;
};

export type SearchHitRef = SearchHitSnippetRef | SearchHitIndexRef;

export type SearchHitSnippetRef = { snippet: string };

export type SearchHitIndexRef = { hitIndex: number };

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

export function useActiveHitIndex(): number | null {
  return useDocumentStore((s) => s.activeHitIndex);
}

export function useSearchHitCount(): number {
  return useDocumentStore((s) => s.hits.length);
}

export function setSearchHits(hits: HtrHit[], activeHitIndex: number | null) {
  setState({ hits, searchHits: groupByCanvas(hits), activeHitIndex });
}

export function selectSearchHit(hitIndex: number) {
  const { hits, selectedCanvasId } = useDocumentStore.getState();
  const hit = hits[hitIndex];
  if (!hit) {
    return;
  }
  setState({ activeHitIndex: hitIndex });
  if (hit.canvasId !== selectedCanvasId) {
    setSelectedCanvas(hit.canvasId, 'external');
  }
}

export function toActiveHitIndex(
  hits: HtrHit[],
  locatedHitIndex: number | null,
): number | null {
  if (!hits.length) {
    return null;
  }
  return locatedHitIndex ?? 0;
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

export function findActiveSearchHit(s: ActiveSearchHit): HtrHit | null {
  if (s.activeHitIndex === null) {
    return null;
  }
  return s.hits[s.activeHitIndex] ?? null;
}

export function findActiveCanvasSearchHits(
  s: ActiveSearchHit,
  canvasId: CanvasId,
): HtrHit[] {
  const hit = findActiveSearchHit(s);
  return hit?.canvasId === canvasId ? [hit] : noHits;
}
