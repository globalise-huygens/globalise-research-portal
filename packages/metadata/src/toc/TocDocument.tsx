import {
  setSelectedCanvas,
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
};

export function TocDocument(
  { document, isCurrent, selectedCanvasId }: TocDocumentProps,
) {
  const isExpanded = useIsTocDocumentExpanded(document.id);
  const [firstScan] = document.scans;

  return (
    <article
      className="document-detail-overlay-toc-document"
      data-current={isCurrent}
      data-current-document={isCurrent}
    >
      <div className="document-detail-overlay-toc-document-header">
        <button
          type="button"
          className="document-detail-overlay-toc-document-button"
          aria-current={isCurrent || undefined}
          disabled={!firstScan}
          onClick={() => setSelectedCanvas(firstScan.canvasId, 'external')}
        >
          <IconEntityDocument className="document-detail-overlay-icon"/>
          <span>{document.label}</span>
          <small>
            {document.scans.length} scan{document.scans.length === 1 ? '' : 's'}
          </small>
        </button>
        {!!firstScan && (
          <button
            type="button"
            className="document-detail-overlay-toc-document-toggle"
            aria-label={isExpanded ? 'Collapse document' : 'Expand document'}
            aria-expanded={isExpanded}
            onClick={() => toggleTocDocument(document.id)}
          >
            <IconExpandSection
              className="document-detail-overlay-chevron document-detail-overlay-icon-medium"
              data-expanded={isExpanded}
            />
          </button>
        )}
      </div>

      {isExpanded && <TocDocumentMetadata document={document}/>}

      {isExpanded && (
        <div className="document-detail-overlay-toc-document-scans">
          {document.scans.map((scan, i) => (
            <TocScan
              key={scan.canvasId}
              scan={scan}
              documentScan={i + 1}
              isSelected={scan.canvasId === selectedCanvasId}
            />
          ))}
        </div>
      )}
    </article>
  );
}