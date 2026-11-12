import { uriPatterns } from './uriPatterns.ts';
import type { PageRef } from './canvasId';

export type DocumentRef = PageRef & {
  endPage: string;
};

export function parseDocumentId(id: string): DocumentRef | undefined {
  const groups = uriPatterns.document.exec(id)?.groups;
  return groups && { inventory: groups.inventory, page: groups.page, endPage: groups.endPage };
}
