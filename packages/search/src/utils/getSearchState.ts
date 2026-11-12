import { SearchState, FacetValues } from '@knaw-huc/faceted-search-react';
import { getQuery, TreeQuery } from '@knaw-huc/searchfield';

export type GlobaliseSearchState = {
  query?: TreeQuery;
  facets?: FacetValues;
  queryExpansions?: Record<string, string[]>;
};

export default function getSearchState(state: SearchState, expansions?: GlobaliseSearchState['queryExpansions']): GlobaliseSearchState {
  return {
    query: getQuery(state.query ?? '').query ?? undefined,
    facets: state.facetValues,
    queryExpansions: expansions,
  };
}
