import { useEffect, useMemo, useRef } from 'react';
import {
  clearTocRevealRequest,
  expandTocDocument,
  useDocumentStore,
  useSelectedCanvas,
} from '@globalise/common/document';
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

  useScrollToThumb(tocListRef);

  const revealRequest = useDocumentStore((s) => s.toc.revealRequest);

  useEffect(() => {
    if (!revealRequest) {
      return;
    }
    const documentId = revealRequest.documentIds.find((id) =>
      documents.some((document) => document.id === id),
    );
    if (!documentId) {
      return;
    }
    const target = tocListRef.current?.querySelector<HTMLButtonElement>(
      `[data-document-id="${CSS.escape(documentId)}"] .select`,
    );
    const article = target?.closest<HTMLElement>('.toc-document');
    if (target && article) {
      // Opening the sidebar animates its width, changing document heights.
      // Reveal once that layout settles, then stop observing entirely.
      let timer: ReturnType<typeof setTimeout>;
      const observer = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          observer.disconnect();
          target.focus({ preventScroll: true });
          article.scrollIntoView({ block: 'start', inline: 'nearest' });
          clearTocRevealRequest();
        }, 80);
      });
      observer.observe(tocListRef.current!);
      return () => {
        observer.disconnect();
        clearTimeout(timer);
      };
    }
  }, [revealRequest, documents]);

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
      <div className="list" ref={tocListRef}>
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
