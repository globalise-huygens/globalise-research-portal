import getSearchState, { type GlobaliseSearchState } from './getSearchState';
import { type ManifestUrlParams, validateSearchUrlParams } from '@globalise/router';
import { toSearchState } from '../url';

export type ManifestSearchState = GlobaliseSearchState & {
  docDbId: string;
  docEsId: string;
  snippet: string;
};

export default function getManifestSearchState(urlParams: ManifestUrlParams): ManifestSearchState | undefined {
  const { document: docDbId, documentId: docEsId, snippet } = urlParams;
  if (!docDbId || !docEsId || !snippet) {
    return;
  }
  const searchUrlParams = validateSearchUrlParams(urlParams);
  return { ...getSearchState(toSearchState(searchUrlParams)), docDbId, docEsId, snippet };
}
