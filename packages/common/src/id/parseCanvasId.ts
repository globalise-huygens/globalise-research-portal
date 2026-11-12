import { idPatterns } from './idPatterns';
import type { InventoryRef } from './parseManifestId';

export type PageRef = InventoryRef & {
  page: string;
};

export function parseCanvasId(id: string): PageRef | undefined {
  const groups = idPatterns.canvas.exec(id)?.groups;
  return groups && { inventory: groups.inventory, page: groups.page };
}
