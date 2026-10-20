import { fetchJson, getJsonUrl, isLinkedArtNode } from '@globalise/common';
import { queryOptions } from '@tanstack/react-query';
import { isInternalUri } from '../isInternalUri.ts';
import { getRelationValue } from './RelationValueModel.ts';

export function relationValueQueryOptions(uri: string) {
  return queryOptions({
    queryKey: ['relation-value', uri],
    enabled: !!uri,
    staleTime: Infinity,
    retry: false,
    queryFn: async ({ signal }) => await resolveRelationValue(uri, signal) ?? null,
  });
}

export async function resolveRelationValue(uri: string, signal?: AbortSignal): Promise<string | undefined> {
  const gettyUri = /^https?:\/\/vocab\.getty\.edu\/(aat|ulan|tgn)\/\d+$/.test(uri);
  const endpoint = isInternalUri(uri) ? getJsonUrl(uri)
    : gettyUri ? getJsonUrl(uri.replace(/^http:/, 'https:')) : uri;
  const value = await fetchJson<unknown>(endpoint, {
    signal,
    headers: { Accept: 'application/ld+json, application/json' },
  });
  if (!isLinkedArtNode(value)) {
    return undefined;
  }
  const label = getRelationValue(value);
  if (value.type === 'Person' && label === 'Person') {
    return 'Name not recorded';
  }
  return label && label !== value.id && label !== value.type && label !== 'Vocabulary term' && label !== 'Resource'
    ? label : undefined;
}
