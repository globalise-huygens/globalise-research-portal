import { useEffect } from 'react';
import { setSelectedDocument } from '@globalise/common/document';
import { useSelectedDocument } from './useSelectedDocument.ts';

export function useSyncSelectedDocument() {
  const selectedDocumentId = useSelectedDocument()?.id;

  useEffect(rememberSelectedDocument, [selectedDocumentId]);

  function rememberSelectedDocument() {
    if (selectedDocumentId) {
      setSelectedDocument(selectedDocumentId);
    }
  }
}
