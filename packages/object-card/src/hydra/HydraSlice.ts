import { fetchJson, getJsonUrl } from '@globalise/common';
import { setCatalogState, useCatalogStore } from '../CatalogStore.ts';
import { getErrorMessage, isRequested } from '../LoadState.ts';
import { isHydraCollection } from './HydraModel.ts';
import { emptyHydraState, HydraState } from './HydraState.ts';

export type HydraSlice = {
  hydraState: HydraState;
};

export async function loadCollection(uri: string) {
  const { hydraState } = useCatalogStore.getState();
  if (isRequested(hydraState, uri)) {
    return;
  }
  setCatalogState({ hydraState: { ...emptyHydraState, uri, isLoading: true } });

  try {
    const payload = await fetchJson<unknown>(getJsonUrl(uri));
    if (!isHydraCollection(payload)) {
      throw new Error('Not a collection');
    }
    setCatalogState({
      hydraState: { ...emptyHydraState, uri, collection: payload, isReady: true },
    });
  } catch (e) {
    const error = getErrorMessage(e);
    setCatalogState({ hydraState: { ...emptyHydraState, uri, error } });
  }
}

export function useCollection(): HydraState {
  return useCatalogStore((s) => s.hydraState);
}
