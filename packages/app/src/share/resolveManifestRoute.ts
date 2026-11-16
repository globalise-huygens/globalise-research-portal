import { type DocumentRef, type ViewerRef, createViewerPath, parseViewerPath } from '@globalise/common/uri';
import type { SearchHitQuery, SearchHitRequest } from '@globalise/common/document';
import { facets, type ManifestUrlParams } from '@globalise/router';

export type ResolvedManifestRoute = {
  canvasPath: string;
  document?: DocumentRef;
  searchHit?: SearchHitRequest;
  searchHitQuery?: SearchHitQuery;
};

export function resolveManifestRoute(
  path: string,
  search: ManifestUrlParams,
): ResolvedManifestRoute | undefined {
  const ref = parseViewerPath(path);
  if (!ref || !isResolvable(ref, search)) {
    return undefined;
  }
  if ('endPage' in ref) {
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
  return { canvasPath: createViewerPath({ inventory, page }), document };
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
  const queryFacets = Object.fromEntries(
    facets.flatMap(({ key }) => search[key] ? [[key, search[key]]] : []),
  );
  return search.q || Object.keys(queryFacets).length
    ? { query: search.q, facets: queryFacets }
    : undefined;
}

function isResolvable(
  ref: ViewerRef,
  search: ManifestUrlParams,
): boolean {
  return 'endPage' in ref
    || Object.values(search).some((value) => value !== undefined);
}
