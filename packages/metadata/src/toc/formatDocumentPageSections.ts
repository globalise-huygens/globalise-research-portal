import type { ManifestScan } from './toToc.ts';

export function formatDocumentPageSections(sections: ManifestScan[][]): string {
  return sections.map(formatSection).join(', ');
}

function formatSection(section: ManifestScan[]): string {
  const first = section[0].scanNumber;
  const last = section.at(-1)!.scanNumber;
  return first === last ? `${first}` : `${first}-${last}`;
}
