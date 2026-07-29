import { create } from 'zustand';
import type { ConceptSlice } from './ConceptSlice.ts';
import type { SchemesSlice } from './SchemesSlice.ts';
import { emptyConceptState } from './ConceptState.ts';
import { emptySchemesState } from './SchemesState.ts';

export type ObjectCardState =
  & ConceptSlice
  & SchemesSlice;

export const useObjectCardStore = create<ObjectCardState>(() => ({
  conceptState: { ...emptyConceptState },
  schemeState: { ...emptySchemesState },
}));

export const setState = useObjectCardStore.setState;