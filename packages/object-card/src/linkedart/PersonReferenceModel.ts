import { asArray, fetchJson, findByPath, getJsonUrl, isUrl, type LinkedArtNode } from '@globalise/common';
import type { ReferencePanelItemData } from '@globalise/design';
import { isInternalUri } from '../isInternalUri.ts';

const requests = new Map<string, Promise<ReferencePanelItemData[]>>();

function resource(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : undefined;
}

function resourceUri(value: unknown): string | undefined {
  const uri = typeof value === 'string' ? value : resource(value)?.id;
  return typeof uri === 'string' && isUrl(uri) ? uri : undefined;
}

function jsonUri(uri: string): string {
  return isInternalUri(uri) ? getJsonUrl(uri) : uri;
}

function hasType(value: Record<string, unknown>, type: string): boolean {
  return asArray(value.type).includes(type);
}

export function getPersonReferenceLinks(entity: LinkedArtNode): ReferencePanelItemData[] {
  return findByPath(entity, ['subject_of']).flatMap((reference) => {
    const uri = resourceUri(reference);
    if (!uri) {
      return [];
    }
    return [{
      id: uri,
      title: hasType(reference, 'AnnotationCollection') ? 'Corpus mentions' : 'Reference',
      href: jsonUri(uri),
      hrefLabel: `Open reference data: ${uri}`,
      copyLabel: `Copy reference URI: ${uri}`,
      hrefType: 'external' as const,
      uri,
    }];
  });
}

function annotationReference(value: unknown): ReferencePanelItemData | undefined {
  const annotation = resource(value);
  const uri = resourceUri(annotation);
  if (!annotation || !uri) {
    return undefined;
  }
  const canvas = asArray(annotation.partOf).map(resource)
    .find((node) => node && hasType(node, 'Canvas'));
  const canvasUri = resourceUri(canvas);
  const manifest = asArray(canvas?.partOf).map(resource)
    .find((node) => node && hasType(node, 'Manifest'));
  const manifestUri = resourceUri(manifest);
  const scanIdentifier = canvasUri?.split('/canvas:')[1];
  return {
    id: uri,
    title: scanIdentifier ?? 'Corpus mention',
    metadata: 'Corpus mention',
    href: manifestUri && canvasUri
      ? `/manifest?${new URLSearchParams({ manifest: jsonUri(manifestUri), canvas: canvasUri })}`
      : uri,
    hrefType: manifestUri && canvasUri ? 'internal' : 'external',
    hrefLabel: manifestUri && canvasUri ? `Open source scan: ${scanIdentifier ?? canvasUri}` : `Open corpus mention: ${uri}`,
    copyLabel: `Copy corpus mention URI: ${uri}`,
    uri,
  };
}

async function loadCollection(uri: string): Promise<ReferencePanelItemData[]> {
  const collection = resource(await fetchJson<unknown>(jsonUri(uri)));
  if (!collection) {
    throw new Error('Invalid annotation collection');
  }
  const items = new Map<string, ReferencePanelItemData>();
  const addItems = (page: Record<string, unknown>) => {
    for (const annotation of asArray(page.items)) {
      const item = annotationReference(annotation);
      if (item?.id) {
        items.set(item.id, item);
      }
    }
  };
  addItems(collection);
  let next = resourceUri(collection.first);
  const visited = new Set<string>();
  while (next) {
    if (visited.has(next)) {
      throw new Error('Repeated annotation page');
    }
    visited.add(next);
    const page = resource(await fetchJson<unknown>(jsonUri(next)));
    if (!page) {
      throw new Error('Invalid annotation page');
    }
    addItems(page);
    next = resourceUri(page.next);
  }
  return [...items.values()];
}

export async function loadPersonReferences(entity: LinkedArtNode): Promise<ReferencePanelItemData[]> {
  const links = getPersonReferenceLinks(entity);
  const collections = findByPath(entity, ['subject_of'])
    .filter((reference) => hasType(reference, 'AnnotationCollection'));
  const groups = await Promise.all(links.map(async (link) => {
    if (!link.id || !collections.some((reference) => reference.id === link.id)) {
      return [link];
    }
    let request = requests.get(link.id);
    if (!request) {
      request = loadCollection(link.id);
      requests.set(link.id, request);
    }
    try {
      const items = await request;
      return items.length ? items : [link];
    } catch {
      requests.delete(link.id);
      return [link];
    }
  }));
  return [...new Map(groups.flat().map((item) => [item.id, item])).values()];
}
