import { handle, matchUri } from './uriPatterns.ts';
import type { InventoryRef } from './manifestId';
import type { PageRef } from './canvasId';
import type { DocumentRef } from './documentId';

export type ViewerRef = InventoryRef | PageRef | DocumentRef;

export function createViewerPath(
  ref: ViewerRef,
): string {
  const inventoryPath = `/${handle}/inventory:${ref.inventory}`;
  if ('endPage' in ref) {
    return `${inventoryPath}/${ref.page}-${ref.endPage}`;
  }
  if ('page' in ref) {
    return `${inventoryPath}/${ref.page}`;
  }
  return inventoryPath;
}

export function parseViewerPath(
  path: string,
): ViewerRef | undefined {
  const groups = matchUri('viewerPath', path);
  if (!groups) {
    return undefined;
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
