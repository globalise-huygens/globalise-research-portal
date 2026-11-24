import { isUrl } from '@globalise/common';

const internalHosts = new Set([
  'data.globalise.huygens.knaw.nl',
  'id.globalise.nl',
]);

export function isInternalUri(uri?: string): boolean {
  if (!uri) {
    return false;
  }
  if(!isUrl(uri)) {
    return false;
  }
  try {
    return internalHosts.has(new URL(uri).hostname);
  } catch {
    return false;
  }
}
