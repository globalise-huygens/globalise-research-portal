import type { DocumentRef, ViewerRef } from '@globalise/common/uri';
import type { SearchHitQuery, SearchHitRequest } from '@globalise/common/document';

/**
 * All state present in a sharable route
 */
export type SharableRouteState = {
  ref: ViewerRef;
  searchHit: SearchHitRequest | null;
  searchHitQuery: SearchHitQuery | null;
};

export type StoredRouteState = {
  selectedDocument?: DocumentRef;
  searchHit: SearchHitRequest | null;
  searchHitQuery: SearchHitQuery | null;
};

export function collectSharableRouteState(
  viewer: ViewerRef,
  { selectedDocument, searchHit, searchHitQuery }: StoredRouteState,
): SharableRouteState {
  const isSearchHitInView = searchHit?.document.inventory === viewer.inventory;
  return {
    ref: isFirstPageOf(viewer, selectedDocument) ? selectedDocument : viewer,
    searchHit: isSearchHitInView ? searchHit : null,
    searchHitQuery: isSearchHitInView ? searchHitQuery : null,
  };
}

function isFirstPageOf(
  viewer: ViewerRef,
  document: DocumentRef | undefined,
): document is DocumentRef {
  return !!document
    && 'page' in viewer
    && !('endPage' in viewer)
    && viewer.inventory === document.inventory
    && viewer.page === document.page;
}
