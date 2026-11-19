import type { SearchState } from '@knaw-huc/faceted-search-react';
import { type SearchUrlParams, validateSearchUrlParams } from '@globalise/router';

export function toSearchUrlParams({ query, sort, facetValues, page }: SearchState): SearchUrlParams {
  return validateSearchUrlParams({ ...facetValues, q: query, sort, page });
}

export function toSearchState({ q, sort, page = 1, ...facetValues }: SearchUrlParams): SearchState {
  return { query: q, sort, facetValues, page };
}
