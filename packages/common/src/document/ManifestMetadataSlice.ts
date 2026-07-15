import { useMemo } from 'react';
import { findByPath, isLinkedArtNode, LinkedArtNode } from '../linkedart';
import { fetchJson } from '../util/fetchJson';
import { setState, useDocumentStore } from './DocumentStore';
import { emptyMetadataState, MetadataState } from './ManifestMetadataState';
import { asArray } from '../util/asArray.ts';

const emptyNodes: LinkedArtNode[] = [];

export async function loadMetadata(url: string) {
  const { metadata } = useDocumentStore.getState();
  const isSameUrl = metadata.url === url;
  if (isSameUrl && (metadata.isReady || metadata.isLoading || metadata.error)) {
    return;
  }
  setState({ metadata: { ...emptyMetadataState, url, isLoading: true } });

  try {
    const root = await fetchJson<unknown>(url);
    if (!isLinkedArtNode(root)) {
      throw new Error('No linked art document');
    }
    setState({ metadata: { ...emptyMetadataState, url, root, isReady: true } });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ metadata: { ...emptyMetadataState, url, error } });
  }
}

export function useMetadata(): MetadataState {
  return useDocumentStore((s) => s.metadata);
}

export function useMetadataRoot(): LinkedArtNode | null {
  return useDocumentStore((s) => s.metadata.root);
}

export function useMetadataNodes(propNamePath: string[]): LinkedArtNode[] {
  const root = useMetadataRoot();
  const path = propNamePath.join('.');
  return useMemo(
    () => root ? findByPath(root, propNamePath) : emptyNodes,
    [root, path],
  );
}

export function useMetadataValues(propNamePath: string[]): string[] {
  const parents = useMetadataNodes(propNamePath.slice(0, -1));
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