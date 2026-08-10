import { LinkedArtNode } from './LinkedArtNode.ts';
import { getLiteral } from './literal.ts';

export function getContent(node: LinkedArtNode): string {
  return getLiteral(node.content);
}
