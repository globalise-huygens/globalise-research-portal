import { useEffect, useMemo, useRef, useState } from 'react';
import { clearTocRevealRequest, expandTocDocument, navigateToc, useDocumentStore, useSelectedCanvas, type TocNavigation } from '@globalise/common/document';
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
  const revealRequest = useDocumentStore((s) => s.toc.revealRequest);

  useEffect(() => {
    const documentId = revealRequest?.documentIds.find((id) =>
      documents.some((document) => document.id === id),
    );
    const list = tocListRef.current;
    if (!documentId || !list) {
      return;
    }
    const article = list.querySelector<HTMLElement>(`[data-document-id="${CSS.escape(documentId)}"]`);
    const header = article?.querySelector<HTMLButtonElement>('button.header');
    if (!article || !header) {
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        observer.disconnect();
        header.focus({ preventScroll: true });
        article.scrollIntoView({ block: 'start', inline: 'nearest' });
        clearTocRevealRequest();
      }, 80);
    });
    observer.observe(list);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [revealRequest, documents]);

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
