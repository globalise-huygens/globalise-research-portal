import { uriPatterns } from './uriPatterns.ts';
import type { InventoryRef } from './manifestId';

export type DocumentRef = InventoryRef & {
  startPage: string;
  endPage: string;
};

export function parseDocumentId(id: string): DocumentRef | undefined {
  const groups = uriPatterns.document.exec(id)?.groups;
  return groups && { inventory: groups.inventory, startPage: groups.startPage, endPage: groups.endPage };
}
