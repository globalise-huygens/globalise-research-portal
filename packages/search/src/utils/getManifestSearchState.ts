import getSearchState, { type GlobaliseSearchState } from './getSearchState';
import { type ManifestUrlParams, validateSearchUrlParams } from '@globalise/router';
import { toSearchState } from '../url';

export type ManifestSearchState = GlobaliseSearchState & {
  documentId: string;
  snippet: string;
};

export default function getManifestSearchState(urlParams: ManifestUrlParams): ManifestSearchState | undefined {
  const { documentId, snippet } = urlParams;
  if (!documentId || !snippet) {
    return;
  }
  const searchUrlParams = validateSearchUrlParams(urlParams);
  return { ...getSearchState(toSearchState(searchUrlParams)), documentId, snippet };
}
