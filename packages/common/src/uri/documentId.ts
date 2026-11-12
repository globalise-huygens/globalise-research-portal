import { idBase, uriPatterns } from './uriPatterns.ts';
import type { PageRef } from './canvasId';

export type DocumentRef = PageRef & {
  endPage: string;
};

export function parseDocumentId(
  id: string,
): DocumentRef | undefined {
  const groups = uriPatterns.document.exec(id)?.groups;
  return groups && { inventory: groups.inventory, page: groups.page, endPage: groups.endPage };
}

export function parseDocumentName(
  name: string,
): DocumentRef | undefined {
  return parseDocumentId(`${idBase}/document:${name}`);
}

export function createDocumentId(
  { inventory, page, endPage }: DocumentRef,
): string {
  return `${idBase}/document:NL-HaNA_1.04.02_${inventory}_${page}-${endPage}`;
}
