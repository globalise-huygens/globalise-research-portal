import type { Vault } from '@iiif/helpers/vault';
import { getValue } from '@iiif/helpers';
import type { MetadataItem } from '@iiif/presentation-3';
import type { CanvasId } from '@globalise/common/document';
import { findThumbnail } from '@knaw-huc/osd-iiif-viewer';

export type ManifestScan = {
  canvasId: CanvasId;
  scanNumber: number;
  thumbnailUrl?: string;
};

export type ManifestDocument = {
  id: string;
  label: string;
  metadataUrl?: string;
  tanapId?: string;
  scans: ManifestScan[];
};

/**
 * Create a table of contents from manifest ranges:
 * the root manifest range contains document ranges,
 * each one referring to all of its canvases.
 * Documents are sorted by scan range.
 * Documents without scans are filtered out.
 */
export function toToc(
  vault: Vault,
  manifestId: string,
): ManifestDocument[] {
  const manifest = vault.get({ id: manifestId, type: 'Manifest' });
  if (!manifest) {
    return [];
  }
  const [rawManifestRange] = manifest.structures ?? [];
  if (!rawManifestRange) {
    return [];
  }
  const manifestRange = vault.get({ id: rawManifestRange.id, type: 'Range' });
  if (!manifestRange) {
    return [];
  }
  const scanNumbers = toScanNumbers(manifest.items);

  return manifestRange.items
    .filter((item) => item.type === 'Range')
    .map((item) => toDocument(vault, item.id, scanNumbers))
    .filter((document) => document.scans.length)
    .sort(compareScanRanges);
}

function compareScanRanges(a: ManifestDocument, b: ManifestDocument): number {
  return a.scans[0].scanNumber - b.scans[0].scanNumber
    || a.scans.at(-1)!.scanNumber - b.scans.at(-1)!.scanNumber;
}

function toScanNumbers(canvasRefs: { id: string }[]): Map<CanvasId, number> {
  const scanNumbers = new Map<CanvasId, number>();
  canvasRefs.forEach((canvas, i) => scanNumbers.set(canvas.id, i + 1));
  return scanNumbers;
}

function toDocument(
  vault: Vault,
  rangeId: string,
  scanNumbers: Map<CanvasId, number>,
): ManifestDocument {
  const range = vault.get({ id: rangeId, type: 'Range' });
  const scans: ManifestScan[] = [];
  for (const item of range.items) {
    if (item.type !== 'SpecificResource') {
      continue;
    }
    if(!item.source) {
      continue;
    }
    const canvas = vault.get({ id: item.source.id, type: 'Canvas' });
    if(!canvas) {
      continue;
    }
    const canvasId = canvas.id;
    const scanNumber = scanNumbers.get(canvasId);
    if (!scanNumber) {
      continue;
    }
    const thumbnailUrl = findThumbnail(vault, canvas, 120) ?? undefined;
    scans.push({ canvasId: canvasId, scanNumber, thumbnailUrl });
  }
  scans.sort((a, b) => a.scanNumber - b.scanNumber);
  const title = findMetadataValue(range.metadata, 'Title');
  return {
    id: range.id,
    label: title ?? getValue(range.label),
    metadataUrl: range.seeAlso[0]?.id,
    tanapId: findMetadataValue(range.metadata, 'TANAP-id'),
    scans,
  };
}

function findMetadataValue(
  metadata: MetadataItem[],
  label: string,
): string | undefined {
  const item = metadata.find((item) => getValue(item.label) === label);
  return item && getValue(item.value);
}
