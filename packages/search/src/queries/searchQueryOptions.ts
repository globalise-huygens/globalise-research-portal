import { infiniteQueryOptions } from '@tanstack/react-query';
import search from '../elasticsearch/search.server';
import type { GlobaliseSearchState } from '../utils/getSearchState';

export default function searchQueryOptions(state: GlobaliseSearchState, pageSize: number) {
  return infiniteQueryOptions({
    queryKey: ['search', pageSize, state.query, state.facets],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: ({ pageParam }) => search({
      data: {
        query: state.query,
        facets: state.facets,
        offset: pageSize * pageParam,
        limit: pageSize,
      },
    }),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 1,
  });
}
