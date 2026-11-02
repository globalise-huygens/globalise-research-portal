import type { SearchState } from '@knaw-huc/faceted-search-react';
import { type SearchUrlParams, validateSearchUrlParams } from '@globalise/router';

export function toSearchUrlParams({ query, sort, facetValues }: SearchState): SearchUrlParams {
  return validateSearchUrlParams({ ...facetValues, q: query, sort });
}

export function toSearchState({ q, sort, ...facetValues }: SearchUrlParams): SearchState {
  return { query: q, sort, facetValues, page: 1 };
}
