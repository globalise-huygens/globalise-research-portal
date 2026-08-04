import { useShallow } from 'zustand/react/shallow';
import { Id } from '../annotation';
import { reindexSearchResults } from './buildCanvasIndexes';
import { type DocumentState, setState, useDocumentStore } from './DocumentStore';
import { CanvasId } from './ManifestViewerSlice';

export type SearchResultId = string;

export type TextPosition = {
  start: number;
  end: number;
};

export type SearchResultBody = {
  id: SearchResultId;
  type: string
  snippet: string
};

export type SearchResult<T extends SearchResultBody = SearchResultBody> = {
  canvasId: CanvasId;
  position: TextPosition;
  body: T;
};

export type FullTextSearchBody = SearchResultBody & {
  type: 'full-text';
  term: string;
  snippet: string;
};

export function isFullTextSearchBody(body: SearchResultBody): body is FullTextSearchBody {
  return body.type === 'full-text';
}

export type SearchResultIndexes = {
  canvasToResults: Record<CanvasId, SearchResultId[]>;
  resultsById: Record<SearchResultId, SearchResult>;
};

export type SearchResultsState = {
  // TODO: ignore search results once manifest ID changes
  manifestId: string | null;
  results: SearchResult[];
  indexes: SearchResultIndexes;
};

export type SearchResultSlice = {
  searchResults: SearchResultsState;
};

export const emptySearchResultIndexes: SearchResultIndexes = {
  canvasToResults: {},
  resultsById: {},
};

export const emptySearchResultsState: SearchResultsState = {
  manifestId: null,
  results: [],
  indexes: emptySearchResultIndexes,
};

export function getSearchResultId(result: SearchResult): SearchResultId {
  return result.body.id;
}

export function setSearchResults(
  manifestId: string,
  results: SearchResult[],
) {
  const canvasToResults: Record<CanvasId, SearchResultId[]> = {};
  const resultsById: Record<SearchResultId, SearchResult> = {};

  for (const result of results) {
    const id = getSearchResultId(result);
    if (resultsById[id]) {
      console.warn('Skipping duplicate search result id:', id);
      continue;
    }
    resultsById[id] = result;
    if (!canvasToResults[result.canvasId]) {
      canvasToResults[result.canvasId] = [];
    }
    canvasToResults[result.canvasId].push(id);
  }

  setState((s) => {
    const searchResults = {
      manifestId,
      results,
      indexes: { canvasToResults, resultsById },
    };
    return {
      searchResults,
      canvasIndexes: reindexSearchResults(
        s.canvases,
        s.canvasIndexes,
        searchResults,
      ),
    };
  });
}

export function clearSearchResults() {
  setState((s) => ({
    searchResults: emptySearchResultsState,
    canvasIndexes: reindexSearchResults(
      s.canvases,
      s.canvasIndexes,
      emptySearchResultsState,
    ),
  }));
}

export function getSearchResult(
  s: DocumentState,
  id: Id | null,
): SearchResult | undefined {
  return id ? s.searchResults.indexes.resultsById[id] : undefined;
}

export function useSearchResults(): SearchResult[] {
  return useDocumentStore((s) => s.searchResults.results);
}

const emptyResults: SearchResult[] = [];

export function useSearchResultsForCanvas(canvasId: CanvasId): SearchResult[] {
  return useDocumentStore(useShallow((s) => {
    const { canvasToResults, resultsById } = s.searchResults.indexes;
    const ids = canvasToResults[canvasId];
    if (!ids?.length) {
      return emptyResults;
    }
    return ids.map((id) => resultsById[id]);
  }));
}

export function useSelectedSearchResult(): SearchResult | undefined {
  return useDocumentStore((s) => getSearchResult(s, s.clickedId));
}
