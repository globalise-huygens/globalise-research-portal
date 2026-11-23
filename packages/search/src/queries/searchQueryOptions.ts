import { infiniteQueryOptions } from '@tanstack/react-query';
import search from '../elasticsearch/search.server';
import type { GlobaliseSearchState } from '../utils/getSearchState';
import type { IndexKey } from '../indices';

export default function searchQueryOptions(index: IndexKey, state: GlobaliseSearchState, pageSize: number) {
  return infiniteQueryOptions({
    queryKey: ['search', pageSize, state.query, state.facets, index],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: ({ pageParam }) => search({
      data: {
        index: index,
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
