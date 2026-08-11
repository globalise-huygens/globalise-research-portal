import { emptyLoadState, LoadState } from '../LoadState.ts';
import { SkosConcept } from './SkosModel.ts';

export type SchemeBundle = {
  '@graph': SkosConcept[];
};

export type SkosSchemesState = LoadState & {
  schemes: SkosConcept[];
};

export const emptySkosSchemesState: SkosSchemesState = {
  ...emptyLoadState,
  schemes: [],
};