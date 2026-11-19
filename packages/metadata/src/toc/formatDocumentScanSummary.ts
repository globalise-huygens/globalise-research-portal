import type { ManifestScan } from './toToc';

export function formatDocumentScanSummary(scans: ManifestScan[]): string {
  const count = `${scans.length} scan${scans.length === 1 ? '' : 's'}`;
  if (!scans.length) {
    return count;
  }

  const ranges: string[] = [];
  let first = scans[0].scanNumber;
  let last = first;

  for (const { scanNumber } of scans.slice(1)) {
    if (scanNumber !== last + 1) {
      ranges.push(formatRange(first, last));
      first = scanNumber;
    }
    last = scanNumber;
  }
  ranges.push(formatRange(first, last));

  return `${count}: ${ranges.join(', ')}`;
}

function formatRange(first: number, last: number): string {
  return first === last ? String(first) : `${first}-${last}`;
}
