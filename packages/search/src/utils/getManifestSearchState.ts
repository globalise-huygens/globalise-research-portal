import { DOCUMENT_ID, SNIPPET } from '@globalise/common/document';
import getSearchState, { type GlobaliseSearchState } from './getSearchState';

export type ManifestSearchState = GlobaliseSearchState & {
  documentId: string;
  snippet: string;
};

export default function getManifestSearchState(): ManifestSearchState | undefined {
  const params = new URLSearchParams(window.location.search);
  const documentId = params.get(DOCUMENT_ID);
  const snippet = params.get(SNIPPET);
  if (!documentId || !snippet) {
    return;
  }
  return { ...getSearchState(), documentId, snippet };
}
