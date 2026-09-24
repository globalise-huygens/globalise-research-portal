import type { ManifestScan } from './toToc.ts';

export function formatDocumentPageSections(runs: ManifestScan[][]): string {
  const first = runs[0][0].scanNumber;
  const last = runs.at(-1)!.at(-1)!.scanNumber;
  if (first === last) {
    return `${first}`;
  }
  const separator = runs.length > 1 ? '-..-' : '-';
  return `${first}${separator}${last}`;
}

/**
 * E.g. 1-3, 5, 8-10
 */
export function formatDocumentPageSection(runs: ManifestScan[][]): string {
  return runs.map((run) => formatDocumentPageSections([run])).join(', ');
}
