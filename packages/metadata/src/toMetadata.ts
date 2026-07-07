import { MetadataEntry } from './MetadataModel';
import { asArray } from './asArray.ts';

export type LinkedArtNode = {
  id?: string;
  type?: string;
  _label?: string;
  content?: string;
  classified_as?: LinkedArtNode[];
  [key: string]: unknown;
};

const entriesToSkip = new Set([
  'type',
  '_label',
  'content',
  'classified_as',
  'id',
  '@context'
]);

export function toMetadata(document: unknown): MetadataEntry[] {
  return isNode(document) ? toMetadataEntry(document).children : [];
}

function toMetadataEntry(
  node: LinkedArtNode,
  key?: string,
): MetadataEntry {
  const children: MetadataEntry[] = [];
  for (const [key, values] of Object.entries(node)) {
    if (entriesToSkip.has(key)) {
      continue;
    }
    for (const value of asArray(values)) {
      if (isNode(value)) {
        children.push(toMetadataEntry(value, key));
      } else {
        const child = {
          source: { propName: key },
          label: key,
          value: String(value),
          children: [],
        } satisfies MetadataEntry;
        children.push(child);
      }
    }
  }

  const source = {
    propName: key,
    classifiedAs: asArray(node.classified_as)[0]?.id,
  };

  return {
    label: toLabel(node, key) ?? '',
    value: node._label ?? node.content ?? '',
    url: getUrl(node), children, source,
  };
}

function toLabel(node: LinkedArtNode, key?: string): string | undefined {
  return asArray(node.classified_as)[0]?._label ?? key ?? node.type;
}

function getUrl(node: LinkedArtNode): string | undefined {
  return isUrl(node.id) ? node.id : undefined;
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