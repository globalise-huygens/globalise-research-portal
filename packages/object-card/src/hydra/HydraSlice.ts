import { fetchJson, getJsonUrl } from '@globalise/common';
import { setCatalogState, useCatalogStore } from '../CatalogStore.ts';
import { getErrorMessage, isRequested } from '../LoadState.ts';
import { isHydraCollection } from './HydraModel.ts';
import { emptyHydraState, HydraState } from './HydraState.ts';

export type HydraSlice = {
  hydraState: HydraState;
};

export async function loadCatalog(uri: string) {
  const { hydraState } = useCatalogStore.getState();
  if (isRequested(hydraState, uri)) {
    return;
  }
  setCatalogState({ hydraState: { ...hydraState, uri, isLoading: true, error: null } });

  try {
    const payload = await fetchJson<unknown>(getJsonUrl(uri));
    if (!isHydraCollection(payload)) {
      throw new Error('Not a collection');
    }
    setCatalogState({
      hydraState: { uri, collection: payload, isLoading: false, isReady: true, error: null },
    });
  } catch (e) {
    const error = getErrorMessage(e);
    setCatalogState({ hydraState: { ...emptyHydraState, uri, error } });
  }
}

export function useCollection(): HydraState {
  return useCatalogStore((s) => s.hydraState);
}
