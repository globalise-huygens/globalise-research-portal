import {
  type DocumentRef, type ViewerRef, createViewerPath, isDocumentRef,
} from '@globalise/common/uri';
import type {
  SearchHitQuery,
  SearchHitRequest,
} from '@globalise/common/document';
import {
  type ManifestUrlParams,
  validateFacets,
} from '@globalise/router';

export type ResolvedManifestRoute = {
  canvasPath: string;
  document?: DocumentRef;
  searchHit?: SearchHitRequest;
  searchHitQuery?: SearchHitQuery;
};

export function resolveManifestRoute(
  ref: ViewerRef,
  search: ManifestUrlParams,
): ResolvedManifestRoute {
  if (isDocumentRef(ref)) {
    return resolveManifestDocumentRoute(ref, search);
  }
  return {
    canvasPath: createViewerPath(ref),
    searchHitQuery: resolveSearchHitQuery(search),
  };
}

function resolveManifestDocumentRoute(
  document: DocumentRef,
  search: ManifestUrlParams,
): ResolvedManifestRoute {
  const { snippet, 'hit-index': esHitIndex } = search;
  if (snippet) {
    return resolveSearchHitRoute({ document, target: { snippet } }, search);
  }
  if (esHitIndex !== undefined) {
    return resolveSearchHitRoute({ document, target: { esHitIndex } }, search);
  }
  return resolveDocumentRoute(document);
}

function resolveDocumentRoute(
  document: DocumentRef,
): ResolvedManifestRoute {
  const { inventory, page } = document;
  const canvasPath = createViewerPath({ inventory, page });
  return { canvasPath, document };
}

function resolveSearchHitRoute(
  searchHit: SearchHitRequest,
  search: ManifestUrlParams,
): ResolvedManifestRoute {
  const document = resolveDocumentRoute(searchHit.document);
  const searchHitQuery = resolveSearchHitQuery(search);
  return {
    ...document,
    searchHit,
    searchHitQuery,
  };
}

function resolveSearchHitQuery(
  search: ManifestUrlParams,
): SearchHitQuery | undefined {
  const facets = validateFacets(search);
  if (!search.q && !Object.keys(facets).length) {
    return;
  }
  return { query: search.q, facets };
}
