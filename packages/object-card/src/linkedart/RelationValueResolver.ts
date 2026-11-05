import { fetchLinkedArtResource } from '@globalise/common';
import { queryOptions } from '@tanstack/react-query';

export function entityResourceQueryOptions(uri: string) {
  return queryOptions({
    queryKey: ['entity-resource', uri],
    enabled: !!uri,
    staleTime: Infinity,
    retry: false,
    queryFn: async ({ signal }) => await fetchLinkedArtResource(uri, signal) ?? null,
  });
}
