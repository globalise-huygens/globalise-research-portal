import type { ManifestScan } from './toToc.ts';

export function toDocumentPageSections(scans: ManifestScan[]): ManifestScan[][] {
  const sections: ManifestScan[][] = [];
  for (const scan of scans) {
    const section = sections.at(-1);
    if (section && section.at(-1)!.scanNumber + 1 === scan.scanNumber) {
      section.push(scan);
    } else {
      sections.push([scan]);
    }
  }
  return sections;
}
