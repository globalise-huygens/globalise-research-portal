import { fetchJson } from '@globalise/common';
import { SkosConcept, getSkosUrl } from './ObjectCardModel.ts';
import { useObjectCardStore, setState } from './ObjectCardStore.ts';

export type ConceptState = {
  uri: string | null;
  concept: SkosConcept | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type ConceptSlice = {
  concept: ConceptState;
};

export const emptyConceptState: ConceptState = {
  uri: null,
  concept: null,
  isLoading: false,
  isReady: false,
  error: null,
};

export async function loadConcept(uri: string) {
  const { concept } = useObjectCardStore.getState();
  const isUrlEqual = concept.uri === uri;
  const isUrlLoaded = concept.isReady || concept.isLoading || concept.error;
  if (isUrlEqual && isUrlLoaded) {
    return;
  }
  setState({ concept: { ...emptyConceptState, uri, isLoading: true } });

  try {
    const url = getSkosUrl(uri);
    const loaded = await fetchJson<SkosConcept>(url);
    setState({
      concept: {
        ...emptyConceptState,
        uri,
        concept: loaded,
        isReady: true,
      },
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ concept: { ...emptyConceptState, uri, error } });
  }
}

export function useConcept(): ConceptState {
  return useObjectCardStore((s) => s.concept);
}

export function useCurrentSchemeId(): string | null {
  return useObjectCardStore((s) => {
    const concept = s.concept.concept;
    if (!concept) {
      return null;
    }
    if (concept.type === 'skos:ConceptScheme') {
      return concept.id;
    }
    return concept.inScheme?.[0]?.id ?? null;
  });
}