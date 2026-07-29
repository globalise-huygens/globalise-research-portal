import { LinkedArtNode } from './LinkedArtNode.ts';
import { isUrl } from '../';

export function url(node: LinkedArtNode): string | undefined {
  return isUrl(node.id) ? node.id : undefined;
}