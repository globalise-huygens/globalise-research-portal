import { isUrl } from '@globalise/common';

const internalHost = 'data.globalise.huygens.knaw.nl';

export function isInternalUri(uri?: string): boolean {
  if (!uri) {
    return false;
  }
  if(!isUrl(uri)) {
    return false;
  }
  try {
    return new URL(uri).hostname === internalHost;
  } catch {
    return false;
  }
}
