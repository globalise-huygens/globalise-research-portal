import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, validateManifestUrlParams } from '@globalise/router';
import {
  setSearchHitQuery,
  setSearchHitRequest,
  setSelectedDocument,
} from '@globalise/common/document';
import { type ViewerRef, createDocumentId } from '@globalise/common/uri';
import { resolveManifestRoute } from './resolveManifestRoute';

export function useResolveManifestRoute(viewer: ViewerRef): boolean {
  const navigate = useNavigate();
  const href = useLocation({ select: (location) => location.href });
  const searchParams = useLocation({ select: (location) => location.search });
  const resolvedRoute = useMemo(
    () => {
      const params = validateManifestUrlParams(searchParams);
      return resolveManifestRoute(viewer, params);
    },
    [viewer, searchParams],
  );
  const isResolved = href === resolvedRoute.canvasPath;

  useEffect(storeResolvedRoute, [navigate, resolvedRoute, isResolved]);

  function storeResolvedRoute() {
    if (isResolved) {
      return;
    }
    if (resolvedRoute.document) {
      setSelectedDocument(createDocumentId(resolvedRoute.document));
    }
    setSearchHitRequest(resolvedRoute.searchHit ?? null);
    setSearchHitQuery(resolvedRoute.searchHitQuery ?? null);
    void navigate({ href: resolvedRoute.canvasPath, replace: true });
  }

  return isResolved;
}
