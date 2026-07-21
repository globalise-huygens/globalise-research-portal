import { useEffect } from 'react';
import { loadMetadata, useMetadata } from '@globalise/common';
import { Pair } from '../common';
import {
  CreatorField, DocumentPageField, PlacesField, TimespanField, TypeField,
} from '../fields';
import type { ManifestDocument } from './toToc';

export type TocDocumentMetadataProps = {
  document: ManifestDocument;
};

const missingValue = null;
const loadingValue = 'loading...';

/**
 * Document metadata combines the manifest range with its linked art document,
 * which is loaded when the document is expanded.
 */
export function TocDocumentMetadata({ document }: TocDocumentMetadataProps) {
  const { metadataUrl } = document;
  const { isLoading } = useMetadata(metadataUrl);
  const fallback = isLoading ? loadingValue : missingValue;

  useEffect(loadDocumentMetadata, [metadataUrl]);

  function loadDocumentMetadata() {
    if (metadataUrl) {
      loadMetadata(metadataUrl)
        .catch(console.error);
    }
  }

  return (
    <dl className="manifest-viewer-toc-document-metadata">
      <TypeField url={metadataUrl} fallback={fallback}/>
      <CreatorField url={metadataUrl} fallback={fallback}/>
      <TimespanField url={metadataUrl} label="Date" fallback={fallback}/>
      <PlacesField url={metadataUrl} label="Location" fallback={fallback}/>
      {document.tanapId && <Pair label="TANAP">{document.tanapId}</Pair>}
      <DocumentPageField url={metadataUrl} fallback={fallback}/>
    </dl>
  );
}
