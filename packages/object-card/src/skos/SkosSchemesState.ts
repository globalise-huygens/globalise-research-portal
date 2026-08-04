import { SkosConcept } from './SkosModel.ts';

export type SchemeBundle = {
  '@graph': SkosConcept[];
};

export type SkosSchemesState = {
  schemes: SkosConcept[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export const emptySkosSchemesState: SkosSchemesState = {
  schemes: [],
  isLoading: false,
  isReady: false,
  error: null,
};