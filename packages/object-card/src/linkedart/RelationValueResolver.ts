import { fetchJson, getJsonUrl, isLinkedArtNode, type LinkedArtNode } from '@globalise/common';
import { isInternalUri } from '../isInternalUri.ts';
import { createResourceCache } from './ResourceCache.ts';

const cachedResource = createResourceCache<LinkedArtNode | undefined>(256);

export function resolveRelationResource(uri: string): Promise<LinkedArtNode | undefined> {
  const gettyUri = /^https?:\/\/vocab\.getty\.edu\/(aat|ulan|tgn)\/\d+$/.test(uri);
  const endpoint = isInternalUri(uri) ? getJsonUrl(uri)
    : gettyUri ? getJsonUrl(uri.replace(/^http:/, 'https:')) : uri;
  return cachedResource(uri, () => fetchJson<unknown>(endpoint, {
    headers: { Accept: 'application/ld+json, application/json' },
  })
    .then((value) => isLinkedArtNode(value) ? value : undefined))
    .catch(() => undefined);
}
