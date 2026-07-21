import { fetchJson } from '@globalise/common';
import { SkosConcept, getSkosUrl } from './ObjectCardModel.ts';
import { useObjectCardStore, setState } from './ObjectCardStore.ts';

export const schemesUri =
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:schemes';

export type SchemeBundle = {
  '@graph': SkosConcept[];
};

export type SchemesState = {
  schemes: SkosConcept[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type SchemesSlice = {
  schemes: SchemesState;
};

export const emptySchemesState: SchemesState = {
  schemes: [],
  isLoading: false,
  isReady: false,
  error: null,
};

export async function loadSchemes() {
  const { schemes } = useObjectCardStore.getState();
  if (schemes.isReady || schemes.isLoading || schemes.error) {
    return;
  }
  setState({ schemes: { ...emptySchemesState, isLoading: true } });

  try {
    const url = getSkosUrl(schemesUri);
    const bundle = await fetchJson<SchemeBundle>(url);
    setState({ schemes: { ...emptySchemesState, schemes: bundle['@graph'], isReady: true } });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ schemes: { ...emptySchemesState, error } });
  }
}

export function useSchemes(): SchemesState {
  return useObjectCardStore((s) => s.schemes);
}