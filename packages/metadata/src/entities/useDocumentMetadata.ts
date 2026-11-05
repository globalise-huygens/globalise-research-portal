import { useEffect, useMemo } from 'react';
import {
  loadMetadata,
  useMetadata,
  type LinkedArtNode,
  type MetadataState,
} from '@globalise/common';
import { useSelectedDocument, type ManifestDocument } from '../toc';
import type { PanelData } from './PanelData.ts';

export function useDocumentMetadata(): PanelData<LinkedArtNode> {
  const document = useSelectedDocument();
  const metadataUrl = document?.metadataUrl;
  const metadata = useMetadata(metadataUrl);

  useEffect(loadDocumentMetadata, [metadataUrl]);

  function loadDocumentMetadata() {
    if (metadataUrl) {
      loadMetadata(metadataUrl)
        .catch(console.error);
    }
  }

  return useMemo(
    () => toPanelData(document, metadata),
    [document, metadata],
  );
}

function toPanelData(
  document: ManifestDocument | undefined,
  { root, error }: MetadataState,
): PanelData<LinkedArtNode> {
  if (!document) {
    return { status: 'noDocument' };
  }
  if (root) {
    return { status: 'ready', data: root };
  }
  return { status: error || !document.metadataUrl ? 'failed' : 'loading' };
}
