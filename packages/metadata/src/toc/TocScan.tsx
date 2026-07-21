import { setSelectedCanvas } from '@globalise/common/document';
import { ReferenceCard } from '@globalise/design/viewer';
import type { ManifestScan } from './toToc';
import { dataCurrentScan } from './useScrollToThumb.ts';

export type TocScanProps = {
  scan: ManifestScan;
  isSelected: boolean;
};

export function TocScan(
  { scan, isSelected }: TocScanProps,
) {
  const thumbnail = scan.thumbnailUrl && (
    <img
      src={scan.thumbnailUrl}
      alt={`Scan ${scan.scanNumber}`}
      loading="lazy"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    />
  );

  const heading = <span className="manifest-viewer-toc-heading">
    Scan {scan.scanNumber}
  </span>;

  return (
    <ReferenceCard
      isSelected={isSelected}
      className="manifest-viewer-toc-card"
      {...{ [dataCurrentScan]: isSelected }}
      onClick={() => setSelectedCanvas(scan.canvasId, 'external')}
      heading={heading}
      thumbnail={thumbnail}
    />
  );
}
