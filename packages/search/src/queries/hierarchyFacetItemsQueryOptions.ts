import { queryOptions } from '@tanstack/react-query';
import { getQuery } from '@knaw-huc/searchfield';
import hierarchyFacetItems from '../elasticsearch/hierarchyFacetItems.server';

export default function hierarchyFacetItemsQueryOptions(key: string, query: string, facets: Record<string, string[]>) {
  return queryOptions({
    queryKey: ['hierarchy', key, query, facets],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => {
      const parsedQuery = getQuery(query);
      return hierarchyFacetItems({
        data: {
          key,
          query: parsedQuery.query,
          facets,
        },
      });
    },
  });
}
