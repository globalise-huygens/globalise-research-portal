import getSearchState, { type GlobaliseSearchState } from './getSearchState';
import { type ManifestUrlParams, validateSearchUrlParams } from '@globalise/router';
import { toSearchState } from '../url';

export type ManifestSearchState = GlobaliseSearchState & {
  docEsId: string;
  snippet: string;
};

export default function getManifestSearchState(urlParams: ManifestUrlParams): ManifestSearchState | undefined {
  const { documentId: docEsId, snippet } = urlParams;
  if (!docEsId || !snippet) {
    return;
  }
  const searchUrlParams = validateSearchUrlParams(urlParams);
  return { ...getSearchState(toSearchState(searchUrlParams)), docEsId, snippet };
}
