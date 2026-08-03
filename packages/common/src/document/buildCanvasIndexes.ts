import {
  Annotation,
  type AnnotationIndexes,
  createWordRanges,
  findPageTextId,
  Id,
  indexAnnotations,
  indexRangesToWordsBlocks,
} from '../annotation';
import type { CanvasId, CanvasState } from './ManifestViewerSlice';
import type { SearchResult, SearchResultsState } from './SearchResultsSlice';
import { toSearchRange } from './toSearchAnnotation';

/**
 * Index annotations and search results of newly lazy-loaded canvases
 */
export function createCanvasIndexes(
  annotations: Record<Id, Annotation>,
  pageAnnoId: Id,
  results: SearchResult[] | undefined,
): AnnotationIndexes {
  const indexes = indexAnnotations(annotations, pageAnnoId);
  return withSearchIndexes(indexes, annotations, results);
}

export function withSearchIndexes(
  indexes: AnnotationIndexes,
  annotations: Record<Id, Annotation> | null,
  results: SearchResult[] | undefined,
): AnnotationIndexes {
  const pageAnnoId = annotations && results?.length
    ? findPageTextId(annotations)
    : undefined;
  if (!annotations || !pageAnnoId) {
    return { ...indexes, searchToWords: {}, searchToBlock: {} };
  }
  const { toWords, toBlock } = indexRangesToWordsBlocks(
    results?.map(toSearchRange) ?? [],
    createWordRanges(annotations, pageAnnoId),
    indexes.wordToBlock,
  );
  return { ...indexes, searchToWords: toWords, searchToBlock: toBlock };
}

/**
 * Index new search results for canvases that are already loaded
 */
export function reindexSearchResults(
  canvases: Record<CanvasId, CanvasState>,
  canvasIndexes: Record<CanvasId, AnnotationIndexes>,
  searchResults: SearchResultsState,
): Record<CanvasId, AnnotationIndexes> {
  const { canvasToResults, resultsById } = searchResults.indexes;
  const reindexed: Record<CanvasId, AnnotationIndexes> = {};

  for (const canvasId of Object.keys(canvasIndexes)) {
    const indexes = canvasIndexes[canvasId];
    const results = canvasToResults[canvasId]?.map((id) => resultsById[id]);
    if (!results?.length && !Object.keys(indexes.searchToWords).length) {
      reindexed[canvasId] = indexes;
      continue;
    }
    reindexed[canvasId] = withSearchIndexes(
      indexes,
      canvases[canvasId]?.annotations ?? null,
      results,
    );
  }

  return reindexed;
}
