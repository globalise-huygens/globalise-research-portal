import { MetadataEntry } from './MetadataModel';
import { asArray } from './asArray.ts';

export type LinkedArtElement = {
  id?: string;
  type?: string;
  _label?: string;
  content?: string;
  classified_as?: LinkedArtElement[];
  [key: string]: unknown;
};

export function toMetadata(
  document: unknown,
  propsToSkip: Set<string>,
): MetadataEntry[] {
  return isLinkedArtElement(document)
    ? toMetadataEntry(document, propsToSkip).children
    : [];
}

function toMetadataEntry(
  node: LinkedArtElement,
  propsToSkip: Set<string>,
  propName?: string,
): MetadataEntry {
  const children: MetadataEntry[] = [];
  for (const [propName, values] of Object.entries(node)) {
    if (propsToSkip.has(propName)) {
      continue;
    }
    for (const value of asArray(values)) {
      if (isLinkedArtElement(value)) {
        children.push(toMetadataEntry(value, propsToSkip, propName));
      } else {
        const child = {
          tags: [propName],
          label: propName,
          value: String(value),
          children: [],
          source: node,
        } satisfies MetadataEntry;
        children.push(child);
      }
    }
  }

  const tags = [];
  if(propName) {
    tags.push(propName);
  }
  const classifiedAs = node.classified_as?.[0]?.id;
  if (classifiedAs) {
    tags.push(classifiedAs);
  }

  return {
    label: toMetadataLabel(node, propName) ?? '',
    value: toMetadataValue(node) ?? '',
    url: getUrl(node),
    children,
    tags,
    source: node,
  };
}

function toMetadataLabel(
  node: LinkedArtElement,
  key?: string,
): string | undefined {
  return asArray(node.classified_as)[0]?._label
    ?? key
    ?? node.type;
}

function toMetadataValue(
  node: LinkedArtElement,
) {
  return node._label
    ?? node.content;
}

function getUrl(node: LinkedArtElement): string | undefined {
  return isUrl(node.id) ? node.id : undefined;
}

function isLinkedArtElement(value: unknown): value is LinkedArtElement {
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