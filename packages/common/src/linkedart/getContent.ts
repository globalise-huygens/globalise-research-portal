import { LinkedArtNode } from './LinkedArtNode.ts';
import { getValue } from './LinkedArtValue.ts';

export function getContent(node: LinkedArtNode): string {
  return getValue(node.content);
}
