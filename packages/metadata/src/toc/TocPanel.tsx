import { useEffect, useMemo } from 'react';
import { expandTocDocument, useSelectedCanvas } from '@globalise/common/document';
import { useToc } from './useToc';
import { TocDocument } from './TocDocument.tsx';

/**
 * Table of contents renders the manifest documents and their scans.
 * Documents are represented as ranges
 */
export function TocPanel() {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();

  const currentDocumentId = useMemo(
    () => documents.find(
      (document) => document.scans.some(
        (scan) => scan.canvasId === selectedCanvasId,
      ),
    )?.id,
    [documents, selectedCanvasId],
  );

  useEffect(expandCurrentDocument, [currentDocumentId]);

  function expandCurrentDocument() {
    if (currentDocumentId) {
      expandTocDocument(currentDocumentId);
    }
  }

  if (!documents.length) {
    return (
      <div className="document-detail-overlay-empty-panel">
        No table of contents for manifest.
      </div>
    );
  }

  return (
    <div className="document-detail-overlay-toc-panel">
      <div className="document-detail-overlay-toc-list">
        {documents.map((document) => (
          <TocDocument
            key={document.id}
            document={document}
            isCurrent={document.id === currentDocumentId}
            selectedCanvasId={selectedCanvasId}
          />
        ))}
      </div>
    </div>
  );
}