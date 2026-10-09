import { SearchState, FacetValues } from '@knaw-huc/faceted-search-react';
import { getQuery, TreeQuery } from '@knaw-huc/searchfield';
import { facets } from '../Facets';

export type GlobaliseSearchState = {
  query?: TreeQuery;
  facets: FacetValues;
};

export default function getSearchState(state?: SearchState): GlobaliseSearchState {
  const params = new URLSearchParams(window.location.search);

  if (!state) {
    const query = params.get('q') ?? undefined;

    const facetValues: FacetValues = {};
    for (const [key, value] of params.entries()) {
      if (facets.map((f) => f.key).includes(key)) {
        if (facetValues[key]) {
          facetValues[key].push(value);
        } else {
          facetValues[key] = [value];
        }
      }
    }

    state = { query, facetValues, page: 1 };
  }

  return {
    query: getQuery(state.query ?? '').query ?? undefined,
    facets: state.facetValues,
  };
}
