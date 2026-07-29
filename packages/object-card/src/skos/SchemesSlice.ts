import { fetchJson } from '@globalise/common';
import { useObjectCardStore, setState } from './ObjectCardStore.ts';
import { emptySchemesState, SchemeBundle, SchemesState } from './SchemesState.ts';
import { getSkosUrl } from './SkosModel.ts';

export const schemesUri =
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:schemes';

export type SchemesSlice = {
  schemeState: SchemesState;
};

export async function loadSchemes() {
  const { schemeState } = useObjectCardStore.getState();
  if (schemeState.isReady || schemeState.isLoading || schemeState.error) {
    return;
  }
  setState({ schemeState: { ...emptySchemesState, isLoading: true } });

  try {
    const url = getSkosUrl(schemesUri);
    const bundle = await fetchJson<SchemeBundle>(url);
    const schemes = bundle['@graph'];
    if(schemes) {
      setState({ schemeState: { ...emptySchemesState, schemes, isReady: true } });
    } else {
      setState({ schemeState: { ...emptySchemesState, schemes, isReady: true, error: 'No schemes found' } });
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ schemeState: { ...emptySchemesState, error } });
  }
}

export function useSchemes(): SchemesState {
  return useObjectCardStore((s) => s.schemeState);
}