import { fetchJson, getJsonUrl, isLinkedArtNode } from '@globalise/common';
import { isInternalUri } from '../isInternalUri.ts';
import { getRelationValue } from './RelationValueModel.ts';
import { createResourceCache } from './ResourceCache.ts';

const cachedLabel = createResourceCache<string | undefined>(256);

export function resolveRelationValue(uri: string): Promise<string | undefined> {
  const gettyUri = /^https?:\/\/vocab\.getty\.edu\/(aat|ulan|tgn)\/\d+$/.test(uri);
  const endpoint = isInternalUri(uri) ? getJsonUrl(uri)
    : gettyUri ? getJsonUrl(uri.replace(/^http:/, 'https:')) : uri;
  return cachedLabel(uri, () => fetchJson<unknown>(endpoint, {
    headers: { Accept: 'application/ld+json, application/json' },
  })
    .then((value) => {
      if (!isLinkedArtNode(value)) {
        return undefined;
      }
      const label = getRelationValue(value);
      if (value.type === 'Person' && label === 'Person') {
        return 'Name not recorded';
      }
      return label && label !== value.id && label !== value.type && label !== 'Vocabulary term' && label !== 'Resource'
        ? label : undefined;
    }))
    .catch(() => undefined);
}
