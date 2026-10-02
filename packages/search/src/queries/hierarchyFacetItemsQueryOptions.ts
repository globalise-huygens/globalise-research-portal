import { queryOptions } from '@tanstack/react-query';
import hierarchyFacetItems from '../elasticsearch/hierarchyFacetItems.server';
import type { GlobaliseSearchState } from '../utils/getSearchState';

export default function hierarchyFacetItemsQueryOptions(key: string, state: GlobaliseSearchState) {
  // Remove values this facet owns: we want all the available items of this facet with filters on the other facets
  const facets = (({ [key]: _ownValues, ...values }) => values)(state.facets);

  return queryOptions({
    queryKey: ['hierarchy', key, state.query, facets],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => hierarchyFacetItems({ data: { key, query: state.query, facets } }),
  });
}
