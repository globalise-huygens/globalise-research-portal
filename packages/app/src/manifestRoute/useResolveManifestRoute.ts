import { useEffect } from 'react';
import { useLocation, useNavigate } from '@globalise/router';
import { setSelectedDocument } from '@globalise/common/document';
import { createDocumentId } from '@globalise/common/uri';
import { resolveManifestRoute } from './resolveManifestRoute';

export function useResolveManifestRoute(): boolean {
  const navigate = useNavigate();
  const { pathname, searchStr } = useLocation();
  const isResolving = resolveManifestRoute(pathname) !== undefined;

  useEffect(storeResolvedRoute, [navigate, pathname, searchStr]);

  function storeResolvedRoute() {
    const route = resolveManifestRoute(pathname);
    if (!route) {
      return;
    }
    setSelectedDocument(createDocumentId(route.document));
    void navigate({ href: `${route.canvasPath}${searchStr}`, replace: true });
  }

  return isResolving;
}
