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
      className="manifest-viewer-toc-document"
      data-current={isCurrent}
      data-current-document={isCurrent}
    >
      <div className="manifest-viewer-toc-document-header">
        <button
          type="button"
          className="manifest-viewer-toc-document-button"
          aria-current={isCurrent || undefined}
          disabled={!firstScan}
          onClick={() => setSelectedCanvas(firstScan.canvasId, 'external')}
        >
          <IconEntityDocument className="manifest-viewer-icon"/>
          <span>{document.label}</span>
          <small>
            {document.scans.length} scan{document.scans.length === 1 ? '' : 's'}
          </small>
        </button>
        {!!firstScan && (
          <button
            type="button"
            className="manifest-viewer-toc-toggle"
            aria-label={isExpanded ? 'Collapse document' : 'Expand document'}
            aria-expanded={isExpanded}
            onClick={() => toggleTocDocument(document.id)}
          >
            <IconExpandSection
              className="manifest-viewer-chevron manifest-viewer-icon-medium"
              data-expanded={isExpanded}
            />
          </button>
        )}
      </div>

      {isExpanded && <TocDocumentMetadata document={document}/>}

      {isExpanded && (
        <div className="manifest-viewer-toc-document-scans">
          {document.scans.map((scan) => (
            <TocScan
              key={scan.canvasId}
              scan={scan}
              isSelected={scan.canvasId === selectedCanvasId}
            />
          ))}
        </div>
      )}
    </article>
  );
}
