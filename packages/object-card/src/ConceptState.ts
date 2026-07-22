import { SkosConcept } from './SchemesState.ts';

export type ConceptState = {
  uri: string | null;
  concept: SkosConcept | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export const emptyConceptState: ConceptState = {
  uri: null,
  concept: null,
  isLoading: false,
  isReady: false,
  error: null,
};

