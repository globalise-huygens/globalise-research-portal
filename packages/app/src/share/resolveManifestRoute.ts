import { type DocumentRef, createViewerPath } from '@globalise/common/uri';
import type {
  SearchHitQuery,
  SearchHitRequest,
} from '@globalise/common/document';
import type { ManifestRoute } from './ManifestRoute';

export type ResolvedManifestRoute = {
  canvasPath: string;
  document?: DocumentRef;
  searchHit?: SearchHitRequest;
  searchHitQuery?: SearchHitQuery;
};

export function resolveManifestRoute(
  route: ManifestRoute,
): ResolvedManifestRoute {
  switch (route.type) {
    case 'hit': {
      const { searchHit, searchHitQuery } = route;
      return { ...resolveDocumentRoute(searchHit.document), searchHit, searchHitQuery };
    }
    case 'document':
      return resolveDocumentRoute(route.ref);
    default:
      return { canvasPath: createViewerPath(route.ref), searchHitQuery: route.searchHitQuery };
  }
}

function resolveDocumentRoute(
  document: DocumentRef,
): ResolvedManifestRoute {
  const { inventory, page } = document;
  const canvasPath = createViewerPath({ inventory, page });
  return { canvasPath, document };
}
