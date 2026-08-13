import { create } from 'zustand';
import type { CardSlice } from './CardSlice.ts';
import type { SkosConceptSlice } from './skos/SkosConceptSlice.ts';
import type { SkosSchemesSlice } from './skos/SkosSchemesSlice.ts';
import type { EntitySlice } from './linkedart/EntitySlice.ts';
import { emptyCardState } from './CardState.ts';
import { emptySkosConceptState } from './skos/SkosConceptState.ts';
import { emptySkosSchemesState } from './skos/SkosSchemesState.ts';
import { emptyEntityState } from './linkedart/EntityState.ts';

export type ObjectCardStoreState =
  & CardSlice
  & SkosConceptSlice
  & SkosSchemesSlice
  & EntitySlice;

export const useObjectCardStore = create<ObjectCardStoreState>(() => ({
  cardState: { ...emptyCardState },
  skosConceptState: { ...emptySkosConceptState },
  skosSchemesState: { ...emptySkosSchemesState },
  entityState: { ...emptyEntityState },
}));

export const setObjectCardState = useObjectCardStore.setState;
