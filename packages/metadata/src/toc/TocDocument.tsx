import { useId } from 'react';
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

export type TocDocumentProps = {
  document: ManifestDocument;
  isCurrent: boolean;
  selectedCanvasId: CanvasId | null;
  onSelect: () => void;
};

export function TocDocument(
  { document, isCurrent, selectedCanvasId, onSelect }: TocDocumentProps,
) {
  const isExpanded = useIsTocDocumentExpanded(document.id);
  const contentId = useId();
  const firstScanNumber = document.scans[0].scanNumber;
  const lastScanNumber = document.scans.at(-1)!.scanNumber;

  return (
    <article
      className="toc-document"
      data-current={isCurrent}
    >
      <Button
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
                isSelected={scan.canvasId === selectedCanvasId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
