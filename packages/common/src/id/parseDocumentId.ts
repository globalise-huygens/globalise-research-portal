import { idPatterns } from './idPatterns';
import type { InventoryRef } from './parseManifestId';

export type DocumentRef = InventoryRef & {
  startPage: string;
  endPage: string;
};

export function parseDocumentId(id: string): DocumentRef | undefined {
  const groups = idPatterns.document.exec(id)?.groups;
  return groups && { inventory: groups.inventory, startPage: groups.startPage, endPage: groups.endPage };
}
