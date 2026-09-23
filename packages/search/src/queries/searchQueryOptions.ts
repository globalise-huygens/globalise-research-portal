import { infiniteQueryOptions } from '@tanstack/react-query';
import search, { SearchRequest } from '../elasticsearch/search.server';

export default function searchQueryOptions(request: SearchRequest, pageSize: number) {
  return infiniteQueryOptions({
    queryKey: ['search', request.query, request.facets, request.offset, request.limit],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: ({ pageParam }) => search({
      data: {
        ...request,
        offset: pageSize * pageParam,
        limit: pageSize,
      },
    }),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 1,
  });
}
