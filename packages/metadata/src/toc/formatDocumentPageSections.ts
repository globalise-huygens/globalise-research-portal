import type { ManifestScan } from './toToc.ts';
import { toDocumentPageSections } from './toDocumentPageSections.ts';

export function formatDocumentScanSummary(scans: ManifestScan[]): string {
  const count = `${scans.length} scan${scans.length === 1 ? '' : 's'}`;
  const ranges = formatDocumentPageSections(toDocumentPageSections(scans));
  return ranges ? `${count}: ${ranges}` : count;
}

export function formatDocumentPageSections(sections: ManifestScan[][]): string {
  return sections.map(formatSection).join(', ');
}

function formatSection(section: ManifestScan[]): string {
  const first = section[0].scanNumber;
  const last = section.at(-1)!.scanNumber;
  return first === last ? `${first}` : `${first}-${last}`;
}
