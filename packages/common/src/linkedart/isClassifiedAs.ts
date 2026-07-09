import { LinkedArtNode } from './LinkedArtNode.ts';
import { findByPath } from './findByPath.ts';

/**
 * Does the linked art node contain the provided Getty AAT url
 * in one of its classified_as properties?
 */
export function isClassifiedAs(node: LinkedArtNode, aatUrl: string): boolean {
  return findByPath(node, ['classified_as']).some((type) => type.id === aatUrl);
}