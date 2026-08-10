import { setState, useObjectCardStore } from '../ObjectCardStore.ts';
import { SkosConceptState } from './SkosConceptState.ts';
import { SkosConcept } from './SkosModel.ts';

export type SkosConceptSlice = {
  skosConceptState: SkosConceptState;
};

export function setConcept(uri: string, concept: SkosConcept) {
  setState({ skosConceptState: { uri, concept } });
}

export function useConcept(): SkosConceptState {
  return useObjectCardStore((s) => s.skosConceptState);
}

export function useCurrentSchemeId(): string | null {
  return useObjectCardStore((s) => {
    const concept = s.skosConceptState.concept;
    if (!concept) {
      return null;
    }
    if (concept.type === 'skos:ConceptScheme') {
      return concept.id;
    }
    return concept.inScheme?.[0]?.id ?? null;
  });
}