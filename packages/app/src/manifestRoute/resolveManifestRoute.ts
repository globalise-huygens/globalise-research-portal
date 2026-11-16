import { type DocumentRef, type ViewerRef, createViewerPath, parseViewerPath } from '@globalise/common/uri';
import type { SearchHitQuery, SearchHitRequest } from '@globalise/common/document';
import { facets, type ManifestUrlParams } from '@globalise/router';

export type ResolvedManifestRoute = {
  canvasPath: string;
  document?: DocumentRef;
  searchHit?: SearchHitRequest;
  searchContext?: SearchHitQuery;
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
    searchContext: resolveSearchContext(search),
  };
}

function resolveManifestDocumentRoute(
  document: DocumentRef,
  search: ManifestUrlParams,
): ResolvedManifestRoute {
  const { inventory, page } = document;
  return {
    canvasPath: createViewerPath({ inventory, page }),
    document,
    searchHit: resolveSearchHit(document, search),
    searchContext: resolveSearchContext(search),
  };
}

function resolveSearchHit(
  document: DocumentRef,
  { documentId, snippet }: ManifestUrlParams,
): SearchHitRequest | undefined {
  return documentId && snippet
    ? { document, docEsId: documentId, snippet }
    : undefined;
}

function resolveSearchContext(
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
