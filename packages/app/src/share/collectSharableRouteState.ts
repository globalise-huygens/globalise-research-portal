import type { DocumentRef, ViewerRef } from '@globalise/common/uri';
import type { SearchHitQuery, SearchHitRequest } from '@globalise/common/document';

/**
 * All state present in a sharable route
 */
export type SharableRouteState = {
  ref: ViewerRef;
  searchHit: SearchHitRequest | null;
  searchHitQuery: SearchHitQuery | null;
  activeEsHitIndex: number | null;
};

export type StoredRouteState = {
  selectedDocument?: DocumentRef;
  searchHit: SearchHitRequest | null;
  searchHitQuery: SearchHitQuery | null;
  activeEsHitIndex: number | null;
};

export function collectSharableRouteState(
  viewer: ViewerRef,
  { selectedDocument, searchHit, searchHitQuery, activeEsHitIndex }: StoredRouteState,
): SharableRouteState {
  const isSearchHitInView = searchHit?.document.inventory === viewer.inventory;
  return {
    ref: isSearchHitInView
      ? searchHit.document
      : findDocumentOnFirstPage(viewer, selectedDocument),
    searchHit: isSearchHitInView ? searchHit : null,
    searchHitQuery: isSearchHitInView ? searchHitQuery : null,
    activeEsHitIndex: isSearchHitInView ? activeEsHitIndex : null,
  };
}

function findDocumentOnFirstPage(
  viewer: ViewerRef,
  selectedDocument: DocumentRef | undefined,
): ViewerRef {
  return isFirstPageOf(viewer, selectedDocument) ? selectedDocument : viewer;
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
