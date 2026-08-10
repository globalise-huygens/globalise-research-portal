import { create } from 'zustand';
import type { ResourceSlice } from './resolve/ResourceSlice.ts';
import type { SkosConceptSlice } from './skos/SkosConceptSlice.ts';
import type { SkosSchemesSlice } from './skos/SkosSchemesSlice.ts';
import type { EntitySlice } from './linkedart/EntitySlice.ts';
import type { HydraSlice } from './hydra/HydraSlice.ts';
import { emptyResourceState } from './resolve/ResourceState.ts';
import { emptySkosConceptState } from './skos/SkosConceptState.ts';
import { emptySkosSchemesState } from './skos/SkosSchemesState.ts';
import { emptyEntityState } from './linkedart/EntityState.ts';
import { emptyHydraState } from './hydra/HydraState.ts';

export type ObjectCardState =
  & ResourceSlice
  & SkosConceptSlice
  & SkosSchemesSlice
  & EntitySlice
  & HydraSlice;

export const useObjectCardStore = create<ObjectCardState>(() => ({
  resourceState: { ...emptyResourceState },
  skosConceptState: { ...emptySkosConceptState },
  skosSchemesState: { ...emptySkosSchemesState },
  entityState: { ...emptyEntityState },
  hydraState: { ...emptyHydraState },
}));

export const setState = useObjectCardStore.setState;
