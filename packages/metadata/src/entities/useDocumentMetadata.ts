import { useEffect } from 'react';
import { loadMetadata, useMetadataRoot } from '@globalise/common';
import { useSelectedDocument } from '../toc';

export function useDocumentMetadata() {
  const document = useSelectedDocument();
  const metadataUrl = document?.metadataUrl;
  const documentMetadata = useMetadataRoot(metadataUrl);

  useEffect(loadDocumentMetadata, [metadataUrl]);

  function loadDocumentMetadata() {
    if (metadataUrl) {
      loadMetadata(metadataUrl)
        .catch(console.error);
    }
  }

  return { document, documentMetadata };
}
