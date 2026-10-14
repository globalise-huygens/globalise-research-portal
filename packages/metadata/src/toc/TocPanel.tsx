import { useEffect, useMemo, useRef, useState } from 'react';
import { expandTocDocument, useSelectedCanvas } from '@globalise/common/document';
import { IconEntityDocument, IconScan, ToolButton } from '@globalise/design';
import { useToc } from './useToc';
import { TocDocument } from './TocDocument.tsx';
import { scrollToTocElement, useScrollToThumb } from './useScrollToThumb.ts';

/**
 * Table of contents renders the manifest documents and their scans.
 * Documents are represented as ranges
 */
export function TocPanel() {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();
  const tocListRef = useRef<HTMLDivElement>(null);
  const [preferredDocumentId, setPreferredDocumentId] = useState<string>();

  useScrollToThumb(tocListRef);

  const currentDocument = useMemo(
    () => documents.find((document) => document.id === preferredDocumentId
      && document.scans.some((scan) => scan.canvasId === selectedCanvasId)) ?? documents.find(
      (document) => document.scans.some(
        (scan) => scan.canvasId === selectedCanvasId,
      ),
    ),
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
    requestAnimationFrame(() => {
      const list = tocListRef.current;
      const header = list?.querySelector<HTMLElement>('.toc-document[data-current="true"] > .header');
      const element = target === 'document' ? header
        : header?.parentElement?.querySelector<HTMLElement>('.toc-card[aria-current="true"]');
      if (!list || !element) {
        return;
      }
      const offset = target === 'scan' ? (header?.offsetHeight ?? 0) : 0;
      const anchor = target === 'document' ? element.parentElement ?? element : element;
      scrollToTocElement(list, anchor, offset);
      element.focus({ preventScroll: true });
    });
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
        {documents.map((document) => (
          <TocDocument
            key={document.id}
            document={document}
            isCurrent={document.id === currentDocumentId}
            selectedCanvasId={selectedCanvasId}
            onSelect={() => setPreferredDocumentId(document.id)}
          />
        ))}
      </div>
    </div>
  );
}
