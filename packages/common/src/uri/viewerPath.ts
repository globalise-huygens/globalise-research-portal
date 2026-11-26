import { handle, matchUri } from './uriPatterns.ts';
import type { InventoryRef } from './manifestId';
import type { PageRef } from './canvasId';
import type { DocumentRef } from './documentId';

export type ViewerRef = InventoryRef | PageRef | DocumentRef;

export function isDocumentRef(ref: ViewerRef): ref is DocumentRef {
  return 'endPage' in ref;
}
export function isPageRef(ref: ViewerRef): ref is PageRef {
  return 'page' in ref && !isDocumentRef(ref);
}
export function isInventoryRef(ref: ViewerRef): ref is InventoryRef {
  return 'inventory' in ref && !isPageRef(ref) && !isDocumentRef(ref);
}

export function createViewerPath(
  ref: ViewerRef,
): string {
  return `${viewerPathPrefix}${createViewerSplat(ref)}`;
}

export const viewerPathPrefix = `/${handle}/inventory:`;

export function createViewerSplat(
  ref: ViewerRef,
): string {
  if ('endPage' in ref) {
    return `${ref.inventory}/${ref.page}-${ref.endPage}`;
  }
  if ('page' in ref) {
    return `${ref.inventory}/${ref.page}`;
  }
  return ref.inventory;
}

export function parseViewerSplat(
  splat: string,
): ViewerRef | null {
  const groups = matchUri('viewerSplat', splat);
  if (!groups) {
    return null;
  }
  const { inventory, page, endPage } = groups;
  if (endPage) {
    return { inventory, page, endPage };
  }
  if (page) {
    return { inventory, page };
  }
  return { inventory };
}
