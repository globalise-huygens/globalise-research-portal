import { useMemo } from 'react';
import { findByPath, isLinkedArtNode, LinkedArtNode } from '../linkedart';
import { fetchJson } from '../util/fetchJson';
import { setState, useDocumentStore } from './DocumentStore';
import { asArray } from '../util/asArray.ts';
import { emptyMetadataState, MetadataState } from './ManifestMetadataState.ts';

/**
 * Linked art metadata, keyed by url:
 * a manifest has one curated holding, but many documents.
 */
export type MetadataSlice = {
  metadata: Record<string, MetadataState>;
};

const emptyNodes: LinkedArtNode[] = [];

export async function loadMetadata(url: string) {
  const existing = useDocumentStore.getState().metadata[url];
  if (existing && (existing.isReady || existing.isLoading || existing.error)) {
    return;
  }
  setMetadata(url, { ...emptyMetadataState, isLoading: true });

  try {
    const root = await fetchJson<unknown>(url);
    if (!isLinkedArtNode(root)) {
      throw new Error('No linked art document');
    }
    setMetadata(url, { ...emptyMetadataState, root, isReady: true });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setMetadata(url, { ...emptyMetadataState, error });
  }
}

function setMetadata(url: string, state: MetadataState) {
  setState((s) => ({ metadata: { ...s.metadata, [url]: state } }));
}

export function useMetadata(url?: string): MetadataState {
  return useDocumentStore(
    (s) => (url ? s.metadata[url] : null) ?? emptyMetadataState,
  );
}

export function useMetadataRoot(url?: string): LinkedArtNode | null {
  return useMetadata(url).root;
}

export function useMetadataNodes(
  url: string | undefined,
  propNamePath: string[],
): LinkedArtNode[] {
  const root = useMetadataRoot(url);
  const path = propNamePath.join('.');
  return useMemo(
    () => root ? findByPath(root, propNamePath) : emptyNodes,
    [root, path],
  );
}

export function useMetadataValues(
  url: string | undefined,
  propNamePath: string[],
): string[] {
  const parents = useMetadataNodes(url, propNamePath.slice(0, -1));
  const propName = propNamePath[propNamePath.length - 1];

  return useMemo(() => {
    const values: string[] = [];
    for (const parent of parents) {
      for (const value of asArray(parent[propName])) {
        if (typeof value !== 'string') {
          continue;
        }
        values.push(value);
      }
    }
    return values;
  }, [parents, propName]);
}