import { fetchJson, getJsonUrl, isLinkedArtNode, type LinkedArtNode } from '@globalise/common';
import { queryOptions } from '@tanstack/react-query';
import { isInternalUri } from '../isInternalUri.ts';

export function entityResourceQueryOptions(uri: string) {
  return queryOptions({
    queryKey: ['entity-resource', uri],
    enabled: !!uri,
    staleTime: Infinity,
    retry: false,
    queryFn: async ({ signal }) => await fetchEntityResource(uri, signal) ?? null,
  });
}

export async function fetchEntityResource(uri: string, signal?: AbortSignal): Promise<LinkedArtNode | undefined> {
  const gettyUri = /^https?:\/\/vocab\.getty\.edu\/(aat|ulan|tgn)\/\d+$/.test(uri);
  const endpoint = isInternalUri(uri) ? getJsonUrl(uri)
    : gettyUri ? getJsonUrl(uri.replace(/^http:/, 'https:')) : uri;
  const value = await fetchJson<unknown>(endpoint, {
    signal,
    headers: { Accept: 'application/ld+json, application/json' },
  });
  return isLinkedArtNode(value) ? value : undefined;
}
