import { setSelectedCanvas } from '@globalise/common/document';
import type { ManifestScan } from './toToc';

export type TocScanProps = {
  scan: ManifestScan;
  isSelected: boolean;
  showThumbnail: boolean;
};

export function TocScan(
  { scan, isSelected, showThumbnail }: TocScanProps,
) {
  const thumbnail = showThumbnail && scan.thumbnailUrl && (
    <img
      src={scan.thumbnailUrl}
      alt=""
      loading="lazy"
      decoding="async"
      width={scan.width}
      height={scan.height}
    />
  );

  return (
    <button
      type="button"
      className="toc-card"
      aria-current={isSelected ? 'true' : undefined}
      onClick={() => setSelectedCanvas(scan.canvasId, 'external')}
    >
      <span className="layout" data-thumbnail={!!thumbnail}>
        {thumbnail && <span className="thumbnail">{thumbnail}</span>}
        <span className="scan-details">
          <span className="toc-heading">Scan {scan.scanNumber}</span>
          {scan.pageMetadata.map((property) => (
            <span className="scan-property" key={property.label}>
              {property.label}: {property.value}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
