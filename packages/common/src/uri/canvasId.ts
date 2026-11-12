import { uriPatterns } from './uriPatterns.ts';
import type { InventoryRef } from './manifestId';

export type PageRef = InventoryRef & {
  page: string;
};

export function parseCanvasId(id: string): PageRef | undefined {
  const groups = uriPatterns.canvas.exec(id)?.groups;
  return groups && { inventory: groups.inventory, page: groups.page };
}
