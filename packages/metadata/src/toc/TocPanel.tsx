import { useEffect, useMemo, useRef, useState } from 'react';
import { expandTocDocument, navigateToc, useSelectedCanvas, type TocNavigation } from '@globalise/common/document';
import { IconEntityDocument, IconScan, ToolButton } from '@globalise/design';
import { useToc } from './useToc';
import { TocDocument } from './TocDocument.tsx';
import { findCurrentDocument } from './tocEntries';

/**
 * Table of contents renders the manifest documents and their scans.
 * Documents are represented as ranges
 */
export function TocPanel() {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();
  const tocListRef = useRef<HTMLDivElement>(null);
  const [preferredDocumentId, setPreferredDocumentId] = useState<string>();

  const currentDocument = useMemo(
    () => findCurrentDocument(documents, selectedCanvasId, preferredDocumentId),
    [documents, selectedCanvasId, preferredDocumentId],
  );
  const currentDocumentId = currentDocument?.id;
  const currentScan = currentDocument?.scans.find((scan) => scan.canvasId === selectedCanvasId);

  useEffect(expandCurrentDocument, [currentDocumentId]);

  function expandCurrentDocument() {
    if (currentDocumentId) {
      expandTocDocument(currentDocumentId);
    }
  }

  function goToCurrent(navigation: TocNavigation) {
    if (currentDocumentId) {
      navigateToc(navigation, currentDocumentId);
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
      <div className="toc-navigation" role="group" aria-label="Go to current selection">
        <span>Go to</span>
        <ToolButton
          size="compact"
          icon={<IconEntityDocument aria-hidden="true"/>}
          aria-label="Go to current document"
          isDisabled={!currentDocument}
          onPress={() => goToCurrent('document')}
        >
          Document
        </ToolButton>
        <ToolButton
          size="compact"
          icon={<IconScan aria-hidden="true"/>}
          aria-label={currentScan ? `Go to current scan ${currentScan.scanNumber}` : 'Go to current scan'}
          isDisabled={!currentScan}
          onPress={() => goToCurrent('scan')}
        >
          {currentScan ? `Scan ${currentScan.scanNumber}` : 'Scan'}
        </ToolButton>
      </div>
      <div className="list" ref={tocListRef}>
        {documents.map((entry) => (
          <TocDocument
            key={entry.id}
            document={entry}
            isCurrent={entry.id === currentDocumentId}
            onSelect={() => setPreferredDocumentId(entry.id)}
            listRef={tocListRef}
          />
        ))}
      </div>
    </div>
  );
}
