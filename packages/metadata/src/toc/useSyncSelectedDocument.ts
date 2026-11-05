import { useEffect } from 'react';
import { setSelectedDocument } from '@globalise/common/document';
import { useSelectedDocument } from './useSelectedDocument.ts';

export function useSyncSelectedDocument() {
  const selectedDocumentId = useSelectedDocument()?.id ?? null;

  useEffect(rememberSelectedDocument, [selectedDocumentId]);

  function rememberSelectedDocument() {
    setSelectedDocument(selectedDocumentId);
  }
}
