import type { CanvasId } from '@globalise/common/document';
import type { ManifestDocument } from './toToc.ts';

export type CanvasDocuments = {
  documents: ManifestDocument[];
  starting: ManifestDocument[];
  ending: ManifestDocument[];
};

export function toCanvasDocuments(
  toc: ManifestDocument[],
): Map<CanvasId, CanvasDocuments> {
  const canvasDocuments = new Map<CanvasId, CanvasDocuments>();

  function getOrCreate(canvasId: CanvasId): CanvasDocuments {
    let entry = canvasDocuments.get(canvasId);
    if (!entry) {
      entry = { documents: [], starting: [], ending: [] };
      canvasDocuments.set(canvasId, entry);
    }
    return entry;
  }

  for (const document of toc) {
    for (const scan of document.scans) {
      getOrCreate(scan.canvasId).documents.push(document);
    }
    getOrCreate(document.scans[0].canvasId).starting.push(document);
    getOrCreate(document.scans.at(-1)!.canvasId).ending.push(document);
  }
  return canvasDocuments;
}
