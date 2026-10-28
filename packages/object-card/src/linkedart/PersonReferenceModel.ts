import { asArray, fetchJson, findByPath, getJsonUrl, isUrl, type LinkedArtNode } from '@globalise/common';
import type { ReferencePanelItemData } from '@globalise/design';
import { isInternalUri } from '../isInternalUri.ts';
import { type QueryClient } from '@tanstack/react-query';

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

/**
 * Keep the original reference for empty or unavailable collections so the
 * source remains accessible even when individual scan links cannot be shown.
 */
export async function loadPersonReferences(entity: LinkedArtNode, queryClient: QueryClient): Promise<ReferencePanelItemData[]> {
  const links = getPersonReferenceLinks(entity);
  const collections = findByPath(entity, ['subject_of'])
    .filter((reference) => hasType(reference, 'AnnotationCollection'));
  const groups = await Promise.all(links.map(async (link) => {
    const uri = link.id;
    if (!uri || !collections.some((reference) => reference.id === uri)) {
      return [link];
    }
    try {
      const items = await queryClient.fetchQuery({
        queryKey: ['person-reference-collection', uri],
        queryFn: ({ signal }) => loadCollection(uri, signal),
        staleTime: Infinity,
        retry: false,
      });
      return items.length ? items : [link];
    } catch {
      return [link];
    }
  }));
  return [...new Map(groups.flat().map((item) => [item.id, item])).values()];
}

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

async function loadCollection(uri: string, signal?: AbortSignal): Promise<ReferencePanelItemData[]> {
  const collection = resource(await fetchJson<unknown>(jsonUri(uri), { signal }));
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
    const pageUri = jsonUri(next);
    if (visited.has(pageUri)) {
      throw new Error('Repeated annotation page');
    }
    visited.add(pageUri);
    const page = resource(await fetchJson<unknown>(pageUri, { signal }));
    if (!page) {
      throw new Error('Invalid annotation page');
    }
    addItems(page);
    next = resourceUri(page.next);
  }
  return [...items.values()];
}
