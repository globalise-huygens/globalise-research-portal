import { useId, useLayoutEffect, useRef, type RefObject } from 'react';
import { Button } from 'react-aria-components';
import {
  clearTocNavigation,
  toggleTocDocument,
  useIsTocDocumentExpanded,
  useSelectedCanvas,
  useTocNavigation,
} from '@globalise/common/document';
import { IconEntityDocument, IconExpandSection } from '@globalise/design';
import type { ManifestDocument } from './toToc';
import { TocDocumentMetadata } from './TocDocumentMetadata.tsx';
import { TocScan } from './TocScan.tsx';
import { scrollToTocElement } from './useScrollToThumb';

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
  const navigation = useTocNavigation();
  const contentId = useId();
  const articleRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const scanRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    const header = headerRef.current;
    const element = navigation === 'document' ? articleRef.current : scanRef.current;
    const focusTarget = navigation === 'document' ? header : scanRef.current;
    if (!isCurrent || !navigation || !list || !element || !focusTarget) {
      return;
    }
    scrollToTocElement(list, element, navigation === 'scan' ? header?.offsetHeight ?? 0 : 0);
    focusTarget.focus({ preventScroll: true });
    clearTocNavigation();
  }, [isCurrent, navigation, listRef, isExpanded]);
  const firstScanNumber = document.scans[0].scanNumber;
  const lastScanNumber = document.scans.at(-1)!.scanNumber;

  return (
    <article
      ref={articleRef}
      className="toc-document"
      data-current={isCurrent}
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
          {document.scans.length} scan{document.scans.length === 1 ? '' : 's'}:
          {' '}{firstScanNumber}
          {firstScanNumber !== lastScanNumber && `–${lastScanNumber}`}
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
