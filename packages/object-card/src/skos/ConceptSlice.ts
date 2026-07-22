import { fetchJson } from '@globalise/common';
import { getSkosUrl } from './SkosModel.ts';
import { useObjectCardStore, setState } from './ObjectCardStore.ts';
import { ConceptState, emptyConceptState } from './ConceptState.ts';
import { SkosConcept } from './SkosModel.ts';

export type ConceptSlice = {
  conceptState: ConceptState;
};

export async function loadConcept(uri: string) {
  const { conceptState } = useObjectCardStore.getState();
  const isUrlEqual = conceptState.uri === uri;
  const isUrlLoaded = conceptState.isReady || conceptState.isLoading || conceptState.error;
  if (isUrlEqual && isUrlLoaded) {
    return;
  }
  setState({ conceptState: { ...emptyConceptState, uri, isLoading: true } });

  try {
    const url = getSkosUrl(uri);
    const loaded = await fetchJson<SkosConcept>(url);
    setState({
      conceptState: {
        ...emptyConceptState,
        uri,
        concept: loaded,
        isReady: true,
      },
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ conceptState: { ...emptyConceptState, uri, error } });
  }
}

export function useConcept(): ConceptState {
  return useObjectCardStore((s) => s.conceptState);
}

export function useCurrentSchemeId(): string | null {
  return useObjectCardStore((s) => {
    const concept = s.conceptState.concept;
    if (!concept) {
      return null;
    }
    if (concept.type === 'skos:ConceptScheme') {
      return concept.id;
    }
    return concept.inScheme?.[0]?.id ?? null;
  });
}