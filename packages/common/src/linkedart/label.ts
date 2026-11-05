import { LinkedArtNode } from './LinkedArtNode.ts';
import { getContent } from './getContent.ts';
import { getValue } from './LinkedArtValue.ts';

export function label(node: LinkedArtNode): string {
  return [
    getValue(node.prefLabel),
    getValue(node.label),
    getContent(node),
    getValue(node.value),
    node.id,
    node.type,
  ].find((value) => !!value) ?? '';
}
