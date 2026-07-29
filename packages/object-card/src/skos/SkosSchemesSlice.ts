import { fetchJson } from '@globalise/common';
import { useObjectCardStore, setState } from './ObjectCardStore.ts';
import { emptySkosSchemesState, SchemeBundle, SkosSchemesState } from './SkosSchemesState.ts';
import { getSkosUrl } from './SkosModel.ts';

export const schemesUri =
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:schemes';

export type SkosSchemesSlice = {
  skosSchemesState: SkosSchemesState;
};

export async function loadSchemes() {
  const { skosSchemesState } = useObjectCardStore.getState();
  if (skosSchemesState.isReady || skosSchemesState.isLoading || skosSchemesState.error) {
    return;
  }
  setState({ skosSchemesState: { ...emptySkosSchemesState, isLoading: true } });

  try {
    const url = getSkosUrl(schemesUri);
    const bundle = await fetchJson<SchemeBundle>(url);
    const schemes = bundle['@graph'];
    if(schemes) {
      setState({ skosSchemesState: { ...emptySkosSchemesState, schemes, isReady: true } });
    } else {
      setState({ skosSchemesState: { ...emptySkosSchemesState, schemes, isReady: true, error: 'No schemes found' } });
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ skosSchemesState: { ...emptySkosSchemesState, error } });
  }
}

export function useSchemes(): SkosSchemesState {
  return useObjectCardStore((s) => s.skosSchemesState);
}