import { LinkedArtNode } from './LinkedArtNode.ts';
import { isLinkedArtNode } from './isLinkedArtNode.ts';
import { getValues } from './LinkedArtValue.ts';
import { asArray } from '../util/asArray.ts';

export type StatusValue = LinkedArtNode | string;

export function getStatusValues(node: LinkedArtNode, keys: string[]): StatusValue[] {
  for (const key of keys) {
    const values = asArray(node[key]).flatMap<StatusValue>((value) =>
      isLinkedArtNode(value) && !('@value' in value)
        ? [value]
        : getValues(value),
    );
    if (values.length) {
      return values;
    }
  }
  return [];
}
