import { create } from 'zustand';
import type { HydraSlice } from './hydra/HydraSlice.ts';
import { emptyHydraState } from './hydra/HydraState.ts';

export type CatalogStoreState = HydraSlice;

export const useCatalogStore = create<CatalogStoreState>(() => ({
  hydraState: { ...emptyHydraState },
}));

export const setCatalogState = useCatalogStore.setState;
