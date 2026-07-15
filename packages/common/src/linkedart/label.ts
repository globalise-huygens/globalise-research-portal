import { LinkedArtNode } from './LinkedArtNode.ts';

export function label(node: LinkedArtNode): string {
  return node._label ?? '';
}