import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, validateManifestUrlParams } from '@globalise/router';
import {
  setSearchHitQuery,
  setSearchHitRequest,
  setSelectedDocument,
} from '@globalise/common/document';
import { createDocumentId } from '@globalise/common/uri';
import { resolveManifestRoute } from './resolveManifestRoute';

export function useResolveManifestRoute(): boolean {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const searchParams = useLocation({ select: (location) => location.search });
  const resolved = useMemo(
    () => resolveManifestRoute(pathname, validateManifestUrlParams(searchParams)),
    [pathname, searchParams],
  );

  useEffect(storeResolvedRoute, [navigate, resolved]);

  function storeResolvedRoute() {
    if (!resolved) {
      return;
    }
    if (resolved.document) {
      setSelectedDocument(createDocumentId(resolved.document));
    }
    setSearchHitRequest(resolved.searchHit ?? null);
    setSearchHitQuery(resolved.searchHitQuery ?? null);
    void navigate({ href: resolved.canvasPath, replace: true });
  }

  return resolved !== undefined;
}
