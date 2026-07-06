import { MetadataEntry } from './MetadataModel.ts';

export type LinkedArtNode = {
  id?: string;
  type?: string;
  _label?: string;
  content?: string;
  classified_as?: LinkedArtNode[];
  [key: string]: unknown;
};

const propsToSkip = new Set(['type', '_label', 'classified_as', 'id', '@context']);

export function toMetadata(document: unknown): MetadataEntry[] {
  return isNode(document) ? toMetadataEntry(document).children : [];
}

function toMetadataEntry(
  node: LinkedArtNode,
  key?: string,
): MetadataEntry {
  const label = toLabel(node, key) ?? '';
  const value = node._label ?? node.content ?? '';
  const url = getUrl(node);

  const children: MetadataEntry[] = [];

  for (const [key, values] of Object.entries(node)) {
    if (propsToSkip.has(key)) {
      continue;
    }
    for (const value of asArray(values)) {
      if (isNode(value)) {
        children.push(toMetadataEntry(value, key));
      } else {
        children.push({ label: key, value: String(value), children: [] });
      }
    }
  }

  return { label, value, url, children };
}

function toLabel(node: LinkedArtNode, key?: string): string | undefined {
  return asArray(node.classified_as)[0]?._label ?? key ?? node.type;
}

function getUrl(node: LinkedArtNode): string | undefined {
  return isUrl(node.id) ? node.id : undefined;
}

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function isNode(value: unknown): value is LinkedArtNode {
  return (
    !!value &&
    typeof value === 'object' &&
    ('type' in value || 'id' in value || 'content' in value)
  );
}

function isUrl(value?: string): boolean {
  if (!value) {
    return false;
  }
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}