import { SkosConcept } from './SkosModel.ts';

export type SkosConceptState = {
  uri: string | null;
  concept: SkosConcept | null;
};

export const emptySkosConceptState: SkosConceptState = {
  uri: null,
  concept: null,
};
