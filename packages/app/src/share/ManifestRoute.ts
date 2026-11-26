import {
  type DocumentRef, type InventoryRef, type PageRef, type ViewerRef, isDocumentRef, isPageRef,
} from '@globalise/common/uri';
import type {
  SearchHitQuery,
  SearchHitRequest,
  SearchHitRef,
} from '@globalise/common/document';
import { type ManifestUrlParams, validateFacets } from '@globalise/router';

/**
 * All routes the manifest viewer can resolve and share
 */
export type ManifestRoute =
  | { type: 'inventory'; ref: InventoryRef; searchHitQuery?: SearchHitQuery }
  | { type: 'scan'; ref: PageRef; searchHitQuery?: SearchHitQuery }
  | { type: 'document'; ref: DocumentRef }
  | { type: 'hit'; searchHit: SearchHitRequest; searchHitQuery?: SearchHitQuery };

export type ManifestRouteType = ManifestRoute['type'];

export function parseManifestRoute(
  ref: ViewerRef,
  search: ManifestUrlParams,
): ManifestRoute {
  const searchHitQuery = parseSearchHitQuery(search);
  const hit = parseSearchHitRef(search);
  if (isDocumentRef(ref) && hit) {
    return { type: 'hit', searchHit: { document: ref, hit }, searchHitQuery };
  }
  return toViewerRoute(ref, searchHitQuery);
}

export function toViewerRoute(
  ref: ViewerRef,
  searchHitQuery?: SearchHitQuery,
): ManifestRoute {
  if (isDocumentRef(ref)) {
    return { type: 'document', ref };
  }
  if (isPageRef(ref)) {
    return { type: 'scan', ref, searchHitQuery };
  }
  return { type: 'inventory', ref, searchHitQuery };
}

function parseSearchHitRef(
  { snippet, 'hit-index': hitIndex }: ManifestUrlParams,
): SearchHitRef | undefined {
  if (snippet) {
    return { snippet };
  }
  if (hitIndex !== undefined) {
    return { hitIndex };
  }
}

function parseSearchHitQuery(
  search: ManifestUrlParams,
): SearchHitQuery | undefined {
  const facets = validateFacets(search);
  if (!search.q && !Object.keys(facets).length) {
    return;
  }
  return { query: search.q, facets };
}
