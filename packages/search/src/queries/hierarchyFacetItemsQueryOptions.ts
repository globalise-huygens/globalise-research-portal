import { queryOptions } from '@tanstack/react-query';
import hierarchyFacetItems, { type HierarchyFacetItemsRequest } from '../elasticsearch/hierarchyFacetItems.server';

export default function hierarchyFacetItemsQueryOptions(request: HierarchyFacetItemsRequest) {
  return queryOptions({
    queryKey: ['hierarchy', request.key, request.query, request.facets],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => hierarchyFacetItems({ data: request }),
  });
}
