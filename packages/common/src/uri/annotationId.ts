import { uriPatterns } from './uriPatterns.ts';
import type { PageRef } from './canvasId';

export type AnnotationRef = PageRef & {
  fragment: string;
};

export function parseAnnotationId(
  id: string,
): AnnotationRef | undefined {
  const groups = uriPatterns.annotation.exec(id)?.groups;
  return groups && { inventory: groups.inventory, page: groups.page, fragment: groups.fragment };
}
