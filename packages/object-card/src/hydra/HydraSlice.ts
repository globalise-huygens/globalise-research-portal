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

export async function loadNextCatalogPage() {
  const { hydraState } = useCatalogStore.getState();
  const next = hydraState.collection?.view?.next;
  if (!next || hydraState.isLoading) {
    return;
  }

  setCatalogState({ hydraState: { ...hydraState, isLoading: true } });
  try {
    const payload = await fetchJson<unknown>(getJsonUrl(next));
    if (!isHydraCollection(payload)) {
      throw new Error('Not a collection');
    }
    const collection = hydraState.collection;
    if (!collection) {
      setCatalogState({ hydraState: { ...hydraState, isLoading: false } });
      return;
    }
    setCatalogState({
      hydraState: {
        ...hydraState,
        collection: {
          ...collection,
          member: [...collection.member, ...payload.member],
          view: payload.view,
        },
        isLoading: false,
      },
    });
  } catch (e) {
    setCatalogState({ hydraState: { ...hydraState, isLoading: false, error: getErrorMessage(e) } });
  }
}

export function useCollection(): HydraState {
  return useCatalogStore((s) => s.hydraState);
}
