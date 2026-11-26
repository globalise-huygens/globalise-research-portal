import { useEffect, useMemo } from 'react';
import { type ManifestUrlParams, getRouteApi, useNavigate } from '@globalise/router';
import {
  setSearchHitQuery,
  setSearchHitRequest,
  setSelectedDocument,
} from '@globalise/common/document';
import { type ViewerRef, createDocumentId, createViewerPath, handle } from '@globalise/common/uri';
import { parseManifestRoute } from './ManifestRoute';
import { resolveManifestRoute } from './resolveManifestRoute';

const route = getRouteApi(`/${handle}/inventory:{$}`);

export function useResolveManifestRoute(viewer: ViewerRef): boolean {
  const navigate = useNavigate();
  const search = route.useSearch();
  const resolvedRoute = useMemo(
    () => resolveManifestRoute(parseManifestRoute(viewer, search)),
    [viewer, search],
  );
  const isResolved = createViewerPath(viewer) === resolvedRoute.canvasPath
    && !hasParams(search);

  useEffect(storeResolvedRoute, [navigate, resolvedRoute, isResolved]);

  function storeResolvedRoute() {
    if (isResolved) {
      return;
    }
    if (resolvedRoute.document) {
      setSelectedDocument(createDocumentId(resolvedRoute.document));
    }
    setSearchHitRequest(resolvedRoute.searchHit);
    setSearchHitQuery(resolvedRoute.searchHitQuery);
    void navigate({ href: resolvedRoute.canvasPath, replace: true });
  }

  return isResolved;
}

function hasParams(search: ManifestUrlParams): boolean {
  return Object.values(search).some((value) => value !== undefined);
}
