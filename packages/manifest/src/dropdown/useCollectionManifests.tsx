import { useEffect, useState } from 'react';
import { Collection, Manifest } from '@iiif/presentation-3';
import { ManifestEntry } from './ManifestEntry.tsx';
import { fetchJson } from '@globalise/common';

export function useCollectionManifests(url: string): ManifestEntry[] {
  const [manifests, setManifests] = useState<ManifestEntry[]>([]);

  useEffect(() => {
    fetchJson<Collection>(url)
      .then((collection) => {
        const items = (collection.items ?? [])
          .filter((item): item is Manifest => item.type === 'Manifest')
          .map((item) => ({
            id: item.id,
            label: getLabel(item.label),
          }));
        setManifests(items);
      })
      .catch(console.error);
  }, [url]);

  return manifests;
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

