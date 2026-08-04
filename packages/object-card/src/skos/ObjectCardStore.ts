import { create } from 'zustand';
import type { SkosConceptSlice } from './SkosConceptSlice.ts';
import type { SkosSchemesSlice } from './SkosSchemesSlice.ts';
import { emptySkosConceptState } from './SkosConceptState.ts';
import { emptySkosSchemesState } from './SkosSchemesState.ts';

export type ObjectCardState =
  & SkosConceptSlice
  & SkosSchemesSlice;

export const useObjectCardStore = create<ObjectCardState>(() => ({
  skosConceptState: { ...emptySkosConceptState },
  skosSchemesState: { ...emptySkosSchemesState },
}));

export const setState = useObjectCardStore.setState;