import { DOCUMENT, DOCUMENT_ID, SNIPPET } from '@globalise/common/document';
import getSearchState, { type GlobaliseSearchState } from './getSearchState';

export type ManifestSearchState = GlobaliseSearchState & {
  docDbId: string;
  docEsId: string;
  snippet: string;
};

export default function getManifestSearchState(): ManifestSearchState | undefined {
  const params = new URLSearchParams(window.location.search);
  const docDbId = params.get(DOCUMENT);
  const docEsId = params.get(DOCUMENT_ID);
  const snippet = params.get(SNIPPET);
  if (!docDbId || !docEsId || !snippet) {
    return;
  }
  return { ...getSearchState(), docDbId, docEsId, snippet };
}
