import { useQuery } from '@tanstack/react-query';
import { Collection, Manifest } from '@iiif/presentation-3';
import { ManifestEntry } from './ManifestEntry.tsx';
import { fetchJson } from '@globalise/common';

export function useCollectionManifests(url: string): ManifestEntry[] {
  const { data = [] } = useQuery({
    queryKey: ['collection', url],
    queryFn: ({ signal }) => fetchJson<Collection>(url, { signal }),
    select: toManifestEntries,
    staleTime: Infinity,
  });
  return data;
}

function toManifestEntries(collection: Collection): ManifestEntry[] {
  return (collection.items ?? [])
    .filter((item): item is Manifest => item.type === 'Manifest')
    .map((item) => ({ id: item.id, label: getLabel(item.label) }));
}

function getLabel(label: unknown): string {
  if (!label) {
    return 'untitled';
  }
  if (typeof label === 'string') {
    return label;
  }
  const values = Object.values(label as Record<string, string[]>).flat();
  return values[0] ?? 'untitled';
}
