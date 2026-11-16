import { useEffect } from 'react';
import { getRouteApi, useLocation, useNavigate } from '@globalise/router';
import {
  setSearchHitQuery,
  setSearchHitRequest,
  setSelectedDocument,
} from '@globalise/common/document';
import { createDocumentId } from '@globalise/common/uri';
import { resolveManifestRoute } from './resolveManifestRoute';

const route = getRouteApi('/hdl:20.500.14722/$');

export function useResolveManifestRoute(): boolean {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const search = route.useSearch();
  const isResolving = resolveManifestRoute(pathname, search) !== undefined;

  useEffect(storeResolvedRoute, [navigate, pathname, search]);

  function storeResolvedRoute() {
    const resolved = resolveManifestRoute(pathname, search);
    if (!resolved) {
      return;
    }
    if (resolved.document) {
      setSelectedDocument(createDocumentId(resolved.document));
    }
    setSearchHitRequest(resolved.searchHit ?? null);
    setSearchHitQuery(resolved.searchContext ?? null);
    void navigate({ href: resolved.canvasPath, replace: true });
  }

  return isResolving;
}
