import { fetchJson } from '../util/fetchJson.ts';
import { getJsonUrl } from './getJsonUrl.ts';
import { isLinkedArtNode } from './isLinkedArtNode.ts';
import type { LinkedArtNode } from './LinkedArtNode.ts';

const internalHost = 'data.globalise.huygens.knaw.nl';
const gettyResourcePattern = /^https?:\/\/vocab\.getty\.edu\/(aat|ulan|tgn)\/\d+$/;

export async function fetchLinkedArtResource(
  uri: string,
  signal?: AbortSignal,
): Promise<LinkedArtNode | undefined> {
  const isInternal = new URL(uri).hostname === internalHost;
  const isGetty = gettyResourcePattern.test(uri);
  const endpoint = isInternal ? getJsonUrl(uri)
    : isGetty ? getJsonUrl(uri.replace(/^http:/, 'https:'))
      : uri;
  const value = await fetchJson<unknown>(endpoint, {
    signal,
    headers: { Accept: 'application/ld+json, application/json' },
  });
  return isLinkedArtNode(value) ? value : undefined;
}
