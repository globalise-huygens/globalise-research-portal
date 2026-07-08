import { MetadataEntry } from './MetadataModel.ts';

export function findChild(
  entry: MetadataEntry,
  tag: string,
): MetadataEntry | undefined {
  return entry.children.find((c) => c.tags.includes(tag));
}