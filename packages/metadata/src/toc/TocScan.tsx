import { setSelectedCanvas } from '@globalise/common/document';
import { DocumentDetailReferenceCard } from '@globalise/design';
import type { ManifestScan } from './toToc';
import { dataCurrentScan } from './useScrollToThumb.ts';

export type TocScanProps = {
  scan: ManifestScan;
  documentScan: number;
  isSelected: boolean;
};

export function TocScan(
  { scan, documentScan, isSelected }: TocScanProps,
) {
  const thumbnail = scan.thumbnailUrl && (
    <img
      src={scan.thumbnailUrl}
      alt={`Scan ${scan.scanNumber}`}
      loading="lazy"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    />
  );

  const heading = <span className="document-detail-overlay-toc-heading">
    Scan {scan.scanNumber}
    <span>| in doc. {documentScan}</span>
  </span>;

  return (
    <DocumentDetailReferenceCard
      isSelected={isSelected}
      className="document-detail-overlay-toc-card"
      {...{ [dataCurrentScan]: isSelected }}
      onClick={() => setSelectedCanvas(scan.canvasId, 'external')}
      heading={heading}
      thumbnail={thumbnail}
    />
  );
}