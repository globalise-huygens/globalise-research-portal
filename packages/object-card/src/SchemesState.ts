import { SkosConcept } from './SkosModel.ts';

export type SchemeBundle = {
  '@graph': SkosConcept[];
};

export type SchemesState = {
  schemes: SkosConcept[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export const emptySchemesState: SchemesState = {
  schemes: [],
  isLoading: false,
  isReady: false,
  error: null,
};