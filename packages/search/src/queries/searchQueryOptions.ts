import { infiniteQueryOptions } from '@tanstack/react-query';
import { getQuery } from '@knaw-huc/searchfield';
import search from '../elasticsearch/search.server';

export default function searchQueryOptions(query: string, facets: Record<string, string[]>, pageSize: number) {
  return infiniteQueryOptions({
    queryKey: ['search', query, facets],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: ({ pageParam }) => {
      const parsedQuery = getQuery(query);
      return search({
        data: {
          query: parsedQuery.query,
          facets,
          offset: pageSize * pageParam,
          limit: pageSize,
        },
      });
    },
    initialPageParam: 0,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 1,
  });
}
