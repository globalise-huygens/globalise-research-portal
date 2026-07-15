import { LinkedArtNode } from './LinkedArtNode.ts';
import { asArray } from '../util/asArray.ts';
import { isLinkedArtNode } from './isLinkedArtNode.ts';

/**
 * Find all linked art elements that match the prop path,
 * parents not included.
 */
export function findByPath(
  node: LinkedArtNode,
  propNamePath: string[],
): LinkedArtNode[] {
  let found = [node];
  for (const propName of propNamePath) {
    found = found.flatMap(
      (node) => asArray(node[propName]).filter(isLinkedArtNode),
    );
  }
  return found;
}