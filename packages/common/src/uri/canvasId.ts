import { idBase, uriPatterns } from './uriPatterns.ts';
import type { InventoryRef } from './manifestId';

export type PageRef = InventoryRef & {
  page: string;
};

export function parseCanvasId(
  id: string,
): PageRef | undefined {
  const groups = uriPatterns.canvas.exec(id)?.groups;
  return groups && { inventory: groups.inventory, page: groups.page };
}

export function parseCanvasName(
  name: string,
): PageRef | undefined {
  return parseCanvasId(`${idBase}/canvas:${name}`);
}

export function createCanvasId(
  { inventory, page }: PageRef,
): string {
  return `${idBase}/canvas:NL-HaNA_1.04.02_${inventory}_${page}`;
}
