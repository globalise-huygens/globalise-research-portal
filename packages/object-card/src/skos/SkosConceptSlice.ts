import { fetchJson } from '@globalise/common';
import { getSkosUrl } from './SkosModel.ts';
import { useObjectCardStore, setState } from './ObjectCardStore.ts';
import { SkosConceptState, emptySkosConceptState } from './SkosConceptState.ts';
import { SkosConcept } from './SkosModel.ts';

export type SkosConceptSlice = {
  skosConceptState: SkosConceptState;
};

export async function loadConcept(uri: string) {
  const { skosConceptState } = useObjectCardStore.getState();
  const isUrlEqual = skosConceptState.uri === uri;
  const isUrlLoaded = skosConceptState.isReady || skosConceptState.isLoading || skosConceptState.error;
  if (isUrlEqual && isUrlLoaded) {
    return;
  }
  setState({ skosConceptState: { ...emptySkosConceptState, uri, isLoading: true } });

  try {
    const url = getSkosUrl(uri);
    const loaded = await fetchJson<SkosConcept>(url);
    setState({
      skosConceptState: {
        ...emptySkosConceptState,
        uri,
        concept: loaded,
        isReady: true,
      },
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ skosConceptState: { ...emptySkosConceptState, uri, error } });
  }
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