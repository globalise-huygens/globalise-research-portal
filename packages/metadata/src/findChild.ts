import { MetadataNode } from './MetadataModel.ts';

export function findChild(
  entry: MetadataNode,
  tag: string,
): MetadataNode | undefined {
  return entry.children.find((c) => c.tags.includes(tag));
}