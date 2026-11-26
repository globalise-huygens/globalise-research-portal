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
    const { hostname, pathname } = new URL(uri);
    return hostname === internalHost
      || (hostname === 'id.globalise.nl'
        && pathname.startsWith('/hdl:20.500.14722/'));
  } catch {
    return false;
  }
}
