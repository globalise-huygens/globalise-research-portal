import { setSelectedCanvas } from '@globalise/common/document';
import type { ManifestScan } from './toToc';

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

  return (
    <button
      type="button"
      className="toc-card"
      aria-current={isSelected ? 'true' : undefined}
      onClick={() => setSelectedCanvas(scan.canvasId, 'external')}
    >
      <span className="layout">
        {thumbnail && <span className="thumbnail">{thumbnail}</span>}
        <span className="toc-heading">Scan {scan.scanNumber}</span>
      </span>
    </button>
  );
}
