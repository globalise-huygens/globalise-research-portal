import { fetchJson, LinkedArtNode, getJsonUrl } from '@globalise/common';
import { setState, useObjectCardStore } from '../ObjectCardStore.ts';
import { setConcept, SkosConcept } from '../skos';
import { setEntity } from '../linkedart';
import { setCollection, HydraCollection } from '../hydra';
import { emptyResourceState, ResourceType, ResourceState } from './ResourceState.ts';
import { resolveResourceType } from './resolveResourceType.ts';

export type ResourceSlice = {
  resourceState: ResourceState;
};

export async function loadResource(uri: string) {
  const { resourceState } = useObjectCardStore.getState();
  const isUriEqual = resourceState.uri === uri;
  const isUriLoaded = resourceState.isReady || resourceState.isLoading || resourceState.error;
  if (isUriEqual && isUriLoaded) {
    return;
  }
  setState({ resourceState: { ...emptyResourceState, uri, isLoading: true } });

  try {
    const payload = await fetchJson<unknown>(getJsonUrl(uri));
    const type = resolveResourceType(payload);
    if (!type) {
      throw new Error('Unknown resource format');
    }
    keep(type, uri, payload);
    setState({ resourceState: { ...emptyResourceState, uri, type, isReady: true } });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ resourceState: { ...emptyResourceState, uri, error } });
  }
}

export function useResource(): ResourceState {
  return useObjectCardStore((s) => s.resourceState);
}

function keep(type: ResourceType, uri: string, payload: unknown) {
  switch (type) {
    case 'skos':
      setConcept(uri, payload as SkosConcept);
      break;
    case 'entity':
      setEntity(uri, payload as LinkedArtNode);
      break;
    case 'hydra':
      setCollection(uri, payload as HydraCollection);
      break;
  }
}
