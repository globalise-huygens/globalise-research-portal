import type { DocumentRef, ViewerRef } from '@globalise/common/uri';

export function findViewerDocument(
  viewer: ViewerRef,
  selectedDocument: DocumentRef | undefined,
): ViewerRef {
  const isOnFirstPage = selectedDocument
    && 'page' in viewer
    && !('endPage' in viewer)
    && viewer.inventory === selectedDocument.inventory
    && viewer.page === selectedDocument.page;
  return isOnFirstPage ? selectedDocument : viewer;
}
