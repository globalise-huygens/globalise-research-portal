import { useId, useRef, type RefObject } from 'react';
import { Button } from 'react-aria-components';
import {
  toggleTocDocument,
  useIsTocDocumentExpanded,
  useSelectedCanvas,
} from '@globalise/common/document';
import { IconEntityDocument, IconExpandSection } from '@globalise/design';
import type { ManifestDocument } from './toToc';
import { TocDocumentMetadata } from './TocDocumentMetadata.tsx';
import { TocScan } from './TocScan.tsx';
import { formatDocumentScanSummary } from './formatDocumentPageSections.ts';
import { useScrollToSelectedInToc } from './useScrollToSelectedInToc.ts';
import { useSyncSelectedScanInToc } from './useSyncSelectedScanInToc.ts';

export type TocDocumentProps = {
  document: ManifestDocument;
  isCurrent: boolean;
  onSelect: () => void;
  listRef: RefObject<HTMLDivElement | null>;
};

export function TocDocument(
  { document, isCurrent, onSelect, listRef }: TocDocumentProps,
) {
  const isExpanded = useIsTocDocumentExpanded(document.id);
  const { id: selectedCanvasId } = useSelectedCanvas();
  const contentId = useId();
  const articleRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const scanRef = useRef<HTMLButtonElement>(null);
  useSyncSelectedScanInToc({ isCurrent, listRef, headerRef, scanRef });
  useScrollToSelectedInToc({ isCurrent, isExpanded, listRef, articleRef, headerRef, scanRef });

  return (
    <article
      ref={articleRef}
      className="toc-document"
      data-current={isCurrent}
      data-document-id={document.id}
    >
      <Button
        ref={headerRef}
        className="header"
        aria-current={isCurrent || undefined}
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? contentId : undefined}
        onPress={() => toggleTocDocument(document.id)}
      >
        <IconEntityDocument className="document-icon" aria-hidden="true"/>
        <span className="document-title">{document.label}</span>
        <IconExpandSection className="disclosure-icon" aria-hidden="true"/>
        <small>
          {isCurrent && 'Current document · '}
          {formatDocumentScanSummary(document.scans)}
        </small>
      </Button>

      {isExpanded && (
        <div id={contentId}>
          <TocDocumentMetadata document={document}/>
          <div className="scans">
            {document.scans.map((scan) => {
              const isSelected = isCurrent && scan.canvasId === selectedCanvasId;
              return (
                <TocScan
                  key={scan.canvasId}
                  scan={scan}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  scanRef={isSelected ? scanRef : undefined}
                />
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
