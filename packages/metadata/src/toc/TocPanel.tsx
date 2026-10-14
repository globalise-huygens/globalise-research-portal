import { useEffect, useMemo, useRef } from 'react';
import { Checkbox } from '@globalise/design';
import { expandTocDocument, setShowTocThumbnails, useSelectedCanvas, useSettingsStore } from '@globalise/common/document';
import { useToc } from './useToc';
import { TocDocument } from './TocDocument.tsx';
import { useScrollToThumb } from './useScrollToThumb.ts';

/**
 * Table of contents renders the manifest documents and their scans.
 * Documents are represented as ranges
 */
export function TocPanel() {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();
  const tocListRef = useRef<HTMLDivElement>(null);
  const showThumbnails = useSettingsStore((state) => state.showTocThumbnails);

  useScrollToThumb(tocListRef);

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
      <div className="toc-empty">
        No table of contents for manifest.
      </div>
    );
  }

  return (
    <div className="toc-panel">
      <div className="toc-options">
        <Checkbox isSelected={showThumbnails} onChange={setShowTocThumbnails}>
          Show thumbnails
        </Checkbox>
      </div>
      <div className="list" ref={tocListRef}>
        {documents.map((document) => (
          <TocDocument
            key={document.id}
            document={document}
            isCurrent={document.id === currentDocumentId}
            selectedCanvasId={selectedCanvasId}
            showThumbnails={showThumbnails}
          />
        ))}
      </div>
    </div>
  );
}
