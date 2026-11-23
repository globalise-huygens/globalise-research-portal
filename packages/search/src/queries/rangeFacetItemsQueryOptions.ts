import { queryOptions } from '@tanstack/react-query';
import rangeFacetItems from '../elasticsearch/rangeFacetItems.server';
import type { GlobaliseSearchState } from '../utils/getSearchState';
import type { IndexKey } from '../indices';

export default function rangeFacetItemsQueryOptions(index: IndexKey, key: string, state: GlobaliseSearchState) {
  return queryOptions({
    queryKey: [...rangeFacetItemsQueryKey(index, key), state.query, state.facets],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => rangeFacetItems({ data: { index, key, query: state.query, facets: state.facets } }),
  });
}

export const rangeFacetItemsQueryKey = (index: IndexKey, key: string) => ['range', index, key];
