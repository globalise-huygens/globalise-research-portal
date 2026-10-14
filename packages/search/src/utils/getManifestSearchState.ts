import { DOCUMENT, DOCUMENT_ID, SNIPPET } from '@globalise/common/document';
import getSearchState, { type GlobaliseSearchState } from './getSearchState';

export type ManifestSearchState = GlobaliseSearchState & {
  document: string;
  documentId: string;
  snippet: string;
};

export default function getManifestSearchState(): ManifestSearchState | undefined {
  const params = new URLSearchParams(window.location.search);
  const document = params.get(DOCUMENT);
  const documentId = params.get(DOCUMENT_ID);
  const snippet = params.get(SNIPPET);
  if (!document || !documentId || !snippet) {
    return;
  }
  return { ...getSearchState(), document, documentId, snippet };
}
