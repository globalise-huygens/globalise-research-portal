import { idPatterns } from './idPatterns';
import type { PageRef } from './parseCanvasId';

export type AnnotationRef = PageRef & {
  fragment: string;
};

export function parseAnnotationId(id: string): AnnotationRef | undefined {
  const groups = idPatterns.annotation.exec(id)?.groups;
  return groups && { inventory: groups.inventory, page: groups.page, fragment: groups.fragment };
}
