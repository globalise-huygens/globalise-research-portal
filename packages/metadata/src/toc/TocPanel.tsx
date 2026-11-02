import { useEffect, useMemo, useRef, useState } from 'react';
import { expandTocDocument, useSelectedCanvas } from '@globalise/common/document';
import { IconEntityDocument, IconScan, ToolButton } from '@globalise/design';
import { useToc } from './useToc';
import { TocDocument } from './TocDocument.tsx';
import { useScrollToThumb } from './useScrollToThumb.ts';
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
  const [navigation, setNavigation] = useState<{ target: 'document' | 'scan'; canvasId: string | null; documentId?: string }>();

  useScrollToThumb(tocListRef);

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

  function goToCurrent(target: 'document' | 'scan') {
    if (target === 'scan' && currentDocumentId) {
      expandTocDocument(currentDocumentId);
    }
    setNavigation({ target, canvasId: selectedCanvasId, documentId: currentDocumentId });
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
            selectedCanvasId={selectedCanvasId}
            onSelect={() => setPreferredDocumentId(entry.id)}
            listRef={tocListRef}
            onNavigated={() => setNavigation(undefined)}
            navigation={entry.id === currentDocumentId && navigation?.documentId === currentDocumentId
              && navigation.canvasId === selectedCanvasId ? navigation : undefined}
          />
        ))}
      </div>
    </div>
  );
}
