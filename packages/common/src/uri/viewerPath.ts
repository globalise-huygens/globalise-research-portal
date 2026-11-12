import { uriPatterns } from './uriPatterns.ts';
import type { InventoryRef } from './manifestId';
import type { PageRef } from './canvasId';
import type { DocumentRef } from './documentId';

export type ViewerRef = InventoryRef | PageRef | DocumentRef;

export function createViewerPath(ref: ViewerRef): string {
  const inventoryPath = `/hdl:20.500.14722/inventory:${ref.inventory}`;
  if ('page' in ref) {
    return `${inventoryPath}/${ref.page}`;
  }
  if ('startPage' in ref) {
    return `${inventoryPath}/${ref.startPage}-${ref.endPage}`;
  }
  return inventoryPath;
}

export function parseViewerPath(path: string): ViewerRef | undefined {
  const groups = uriPatterns.viewerPath.exec(path)?.groups;
  if (!groups) {
    return undefined;
  }
  const { inventory, page, startPage, endPage } = groups;
  if (page) {
    return { inventory, page };
  }
  if (startPage) {
    return { inventory, startPage, endPage };
  }
  return { inventory };
}
