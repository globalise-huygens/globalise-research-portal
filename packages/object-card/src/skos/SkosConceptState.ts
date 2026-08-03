import { SkosConcept } from './SkosModel.ts';

export type SkosConceptState = {
  uri: string | null;
  concept: SkosConcept | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export const emptySkosConceptState: SkosConceptState = {
  uri: null,
  concept: null,
  isLoading: false,
  isReady: false,
  error: null,
};

