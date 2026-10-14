import getSearchState, { type GlobaliseSearchState } from './getSearchState';
import { type ManifestUrlParams, validateSearchUrlParams } from '@globalise/router';
import { toSearchState } from '../url';

export type ManifestSearchState = GlobaliseSearchState & {
  document: string;
  documentId: string;
  snippet: string;
};

export default function getManifestSearchState(urlParams: ManifestUrlParams): ManifestSearchState | undefined {
  const { document, documentId, snippet } = urlParams;
  if (!document || !documentId || !snippet) {
    return;
  }
  const searchUrlParams = validateSearchUrlParams(urlParams);
  return { ...getSearchState(toSearchState(searchUrlParams)), document, documentId, snippet };
}
