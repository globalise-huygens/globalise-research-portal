import { LinkedArtNode } from './LinkedArtNode.ts';
import { getValue } from './LinkedArtValue.ts';

export function label(node: LinkedArtNode): string {
  return getValue(node._label);
}
