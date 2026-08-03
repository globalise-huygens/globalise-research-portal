import {
  Annotation,
  Id,
  type OffsetRange,
  type SearchResultBody,
} from '../annotation';
import { getSearchResultId, SearchResult } from './SearchResultsSlice';

export function toSearchAnnotation(
  result: SearchResult,
  pageAnnoId: Id,
): Annotation<SearchResultBody> {
  const { start, end } = result.position;
  return {
    id: getSearchResultId(result),
    type: 'Annotation',
    motivation: 'highlighting',
    body: { type: 'search-result', id: getSearchResultId(result) },
    target: [{
      type: 'SpecificResource',
      source: { id: pageAnnoId, type: 'Annotation' },
      selector: { type: 'TextPositionSelector', start, end },
    }],
  };
}

export function toSearchRange(result: SearchResult): OffsetRange {
  return {
    id: getSearchResultId(result),
    start: result.position.start,
    end: result.position.end,
  };
}
