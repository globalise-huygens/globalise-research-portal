import { SearchState, FacetValues } from '@knaw-huc/faceted-search-react';
import { getQuery, TreeQuery } from '@knaw-huc/searchfield';
import { parseSearch } from '@globalise/common';
import { toSearchState, validateSearchSearch } from '../url/searchSearch';

export type GlobaliseSearchState = {
  query?: TreeQuery;
  facets?: FacetValues;
};

export default function getSearchState(state?: SearchState): GlobaliseSearchState {
  state ??= toSearchState(validateSearchSearch(parseSearch(window.location.search)));

  return {
    query: getQuery(state.query ?? '').query ?? undefined,
    facets: state.facetValues,
  };
}
