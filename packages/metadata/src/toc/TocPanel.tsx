import { useEffect, useMemo, useRef, useState } from 'react';
import { expandTocDocument, useSelectedCanvas } from '@globalise/common/document';
import { IconEntityDocument, IconScan, ToolButton } from '@globalise/design';
import { useManifestScans, useToc } from './useToc';
import { TocScan } from './TocScan.tsx';
import { TocDocument } from './TocDocument.tsx';
import { scrollToTocElement, useScrollToThumb } from './useScrollToThumb.ts';

/**
 * Table of contents renders the manifest documents and their scans.
 * Documents are represented as ranges
 */
export function TocPanel() {
  const documents = useToc();
  const scans = useManifestScans();
  const entries = useMemo(() => {
    const documentCanvasIds = new Set(documents.flatMap((document) => document.scans.map((scan) => scan.canvasId)));
    return [...documents, ...scans.filter((scan) => !documentCanvasIds.has(scan.canvasId))]
      .sort((a, b) => ('scans' in a ? a.scans[0].scanNumber : a.scanNumber)
        - ('scans' in b ? b.scans[0].scanNumber : b.scanNumber));
  }, [documents, scans]);
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
  const currentScan = scans.find((scan) => scan.canvasId === selectedCanvasId);

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
        : (header?.parentElement ?? list)?.querySelector<HTMLElement>('.toc-card[aria-current="true"]');
      if (!list || !element) {
        return;
      }
      const offset = target === 'scan' ? (header?.offsetHeight ?? 0) : 0;
      const anchor = target === 'document' ? element.parentElement ?? element : element;
      scrollToTocElement(list, anchor, offset);
      element.focus({ preventScroll: true });
    });
  }

  if (!entries.length) {
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
        {entries.map((entry) => 'scans' in entry ? (
          <TocDocument
            key={entry.id}
            document={entry}
            isCurrent={entry.id === currentDocumentId}
            selectedCanvasId={selectedCanvasId}
            onSelect={() => setPreferredDocumentId(entry.id)}
          />
        ) : (
          <TocScan
            key={entry.canvasId}
            scan={entry}
            isSelected={entry.canvasId === selectedCanvasId}
            onSelect={() => setPreferredDocumentId(undefined)}
          />
        ))}
      </div>
    </div>
  );
}
