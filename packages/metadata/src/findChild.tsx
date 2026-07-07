import { MetadataNode } from './MetadataModel.ts';

export function findChild(
  entry: MetadataNode,
  propName: string,
): MetadataNode | undefined {
  return entry.children.find((c) => c.source.propName === propName);
}