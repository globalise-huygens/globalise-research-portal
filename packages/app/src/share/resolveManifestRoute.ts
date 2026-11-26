import { type DocumentRef, createViewerPath } from '@globalise/common/uri';
import type {
  SearchHitQuery,
  SearchHitRequest,
} from '@globalise/common/document';
import type { ManifestRoute } from './ManifestRoute';

export type ResolvedManifestRoute = {
  canvasPath: string;
  document: DocumentRef | null;
  searchHit: SearchHitRequest | null;
  searchHitQuery: SearchHitQuery | null;
};

export function resolveManifestRoute(
  route: ManifestRoute,
): ResolvedManifestRoute {
  switch (route.type) {
    case 'hit': {
      const { searchHit, searchHitQuery } = route;
      return { ...resolveDocumentRoute(searchHit.document), searchHit, searchHitQuery: searchHitQuery ?? null };
    }
    case 'document':
      return resolveDocumentRoute(route.ref);
    default:
      return {
        canvasPath: createViewerPath(route.ref),
        document: null,
        searchHit: null,
        searchHitQuery: route.searchHitQuery ?? null,
      };
  }
}

function resolveDocumentRoute(
  document: DocumentRef,
): ResolvedManifestRoute {
  const { inventory, page } = document;
  const canvasPath = createViewerPath({ inventory, page });
  return { canvasPath, document, searchHit: null, searchHitQuery: null };
}
