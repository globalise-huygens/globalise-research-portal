import { fetchJson } from '@globalise/common';
import { getSkosUrl } from './ObjectCardModel.ts';
import { useObjectCardStore, setState } from './ObjectCardStore.ts';
import { emptySchemesState, SchemeBundle, SchemesState } from './SchemesState.ts';

export const schemesUri =
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:schemes';

export type SchemesSlice = {
  schemes: SchemesState;
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