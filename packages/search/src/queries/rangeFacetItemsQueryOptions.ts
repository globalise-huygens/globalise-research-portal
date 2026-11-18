import { queryOptions } from '@tanstack/react-query';
import rangeFacetItems from '../elasticsearch/rangeFacetItems.server';
import type { GlobaliseSearchState } from '../utils/getSearchState';

export default function rangeFacetItemsQueryOptions(key: string, state: GlobaliseSearchState) {
  return queryOptions({
    queryKey: [...rangeFacetItemsQueryKey(key), state.query, state.facets, state.queryExpansions],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => rangeFacetItems({ data: { key, query: state.query, facets: state.facets, queryExpansions: state.queryExpansions } }),
  });
}

export const rangeFacetItemsQueryKey = (key: string) => ['range', key];
