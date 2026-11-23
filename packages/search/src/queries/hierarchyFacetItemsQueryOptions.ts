import { queryOptions } from '@tanstack/react-query';
import hierarchyFacetItems from '../elasticsearch/hierarchyFacetItems.server';
import type { GlobaliseSearchState } from '../utils/getSearchState';
import type { IndexKey } from '../indices';

export default function hierarchyFacetItemsQueryOptions(index: IndexKey, key: string, state: GlobaliseSearchState) {
  // Remove values this facet owns: we want all the available items of this facet with filters on the other facets
  const facets = state.facets ? (({ [key]: _ownValues, ...values }) => values)(state.facets) : undefined;

  return queryOptions({
    queryKey: [...hierarchyFacetItemsQueryKey(index, key), state.query, facets],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => hierarchyFacetItems({ data: { index, key, query: state.query, facets } }),
  });
}

export const hierarchyFacetItemsQueryKey = (index: IndexKey, key: string) => ['hierarchy', index, key];
