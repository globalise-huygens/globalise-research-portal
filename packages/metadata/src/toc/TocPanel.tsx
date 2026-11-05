import { useEffect, useRef } from 'react';
import { expandTocDocument, navigateToc, useSelectedCanvas, type TocNavigation } from '@globalise/common/document';
import { IconEntityDocument, IconScan, ToolButton } from '@globalise/design';
import { useToc } from './useToc';
import { TocDocument } from './TocDocument.tsx';
import { useSelectedDocument } from './useSelectedDocument.ts';

/**
 * Table of contents renders the manifest documents and their scans.
 * Documents are represented as ranges
 */
export function TocPanel() {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();
  const tocListRef = useRef<HTMLDivElement>(null);

  const selectedDocument = useSelectedDocument();
  const selectedDocumentId = selectedDocument?.id;
  const currentScan = selectedDocument?.scans.find((scan) => scan.canvasId === selectedCanvasId);

  useEffect(expandSelectedDocument, [selectedDocumentId]);

  function expandSelectedDocument() {
    if (selectedDocumentId) {
      expandTocDocument(selectedDocumentId);
    }
  }

  function goToCurrent(navigation: TocNavigation) {
    if (selectedDocumentId) {
      navigateToc(navigation, selectedDocumentId);
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
          isDisabled={!selectedDocument}
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
            isCurrent={entry.id === selectedDocumentId}
            listRef={tocListRef}
          />
        ))}
      </div>
    </div>
  );
}
