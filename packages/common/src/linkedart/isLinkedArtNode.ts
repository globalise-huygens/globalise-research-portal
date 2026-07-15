import { LinkedArtNode } from './LinkedArtNode.ts';

export function isLinkedArtNode(
  value: unknown,
): value is LinkedArtNode {
  return (
    !!value &&
    typeof value === 'object' &&
    ('type' in value || 'id' in value || 'content' in value)
  );
}