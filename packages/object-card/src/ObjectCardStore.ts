import { create } from 'zustand';
import type { ConceptSlice, ConceptState } from './ConceptSlice.ts';
import type { SchemesSlice, SchemesState } from './SchemesSlice.ts';

export type ObjectCardState =
  & ConceptSlice
  & SchemesSlice;

export const emptyConceptState: ConceptState = {
  uri: null,
  concept: null,
  isLoading: false,
  isReady: false,
  error: null,
};

export const emptySchemesState: SchemesState = {
  schemes: [],
  isLoading: false,
  isReady: false,
  error: null,
};

export const useObjectCardStore = create<ObjectCardState>(() => ({
  concept: { ...emptyConceptState },
  schemes: { ...emptySchemesState },
}));

export const setState = useObjectCardStore.setState;