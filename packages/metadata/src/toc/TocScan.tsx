import { setSelectedCanvas } from '@globalise/common/document';
import type { ManifestScan } from './toToc';

export type TocScanProps = {
  scan: ManifestScan;
  isSelected: boolean;
  onSelect: () => void;
};

export function TocScan(
  { scan, isSelected, onSelect }: TocScanProps,
) {
  const thumbnail = scan.thumbnailUrl && (
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
      onClick={() => {
        onSelect();
        setSelectedCanvas(scan.canvasId, 'external');
      }}
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
