import { useId, useLayoutEffect, useRef, type RefObject } from 'react';
import { Button } from 'react-aria-components';
import {
  toggleTocDocument,
  useIsTocDocumentExpanded,
  type CanvasId,
} from '@globalise/common/document';
import { IconEntityDocument, IconExpandSection } from '@globalise/design';
import type { ManifestDocument } from './toToc';
import { TocDocumentMetadata } from './TocDocumentMetadata.tsx';
import { TocScan } from './TocScan.tsx';
import { scrollToTocElement } from './useScrollToThumb';

export type TocDocumentProps = {
  document: ManifestDocument;
  isCurrent: boolean;
  selectedCanvasId: CanvasId | null;
  onSelect: () => void;
  listRef: RefObject<HTMLDivElement | null>;
  navigation?: { target: 'document' | 'scan' };
  onNavigated: () => void;
};

export function TocDocument(
  { document, isCurrent, selectedCanvasId, onSelect, listRef, navigation, onNavigated }: TocDocumentProps,
) {
  const isExpanded = useIsTocDocumentExpanded(document.id);
  const contentId = useId();
  const articleRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const scanRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    const header = headerRef.current;
    const element = navigation?.target === 'document' ? articleRef.current : scanRef.current;
    const focusTarget = navigation?.target === 'document' ? header : scanRef.current;
    if (!navigation || !list || !element || !focusTarget) {
      return;
    }
    scrollToTocElement(list, element, navigation.target === 'scan' ? header?.offsetHeight ?? 0 : 0);
    focusTarget.focus({ preventScroll: true });
    onNavigated();
  }, [navigation, listRef, onNavigated, isExpanded]);
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
            {document.scans.map((scan) => (
              <TocScan
                key={scan.canvasId}
                scan={scan}
                isSelected={isCurrent && scan.canvasId === selectedCanvasId}
                onSelect={onSelect}
                scanRef={scan.canvasId === selectedCanvasId && isCurrent ? scanRef : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
