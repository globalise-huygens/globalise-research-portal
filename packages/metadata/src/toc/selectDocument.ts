import type { CanvasId } from '@globalise/common/document';
import type { ManifestDocument } from './toToc';

export function selectDocument(
  documents: ManifestDocument[],
  canvasId: CanvasId | null,
  selectedDocumentId: string | null,
): ManifestDocument | undefined {
  const candidates = documents.filter((document) => containsScan(document, canvasId));
  const selected = candidates.find((document) => document.id === selectedDocumentId);
  return selected ?? candidates[0];
}

function containsScan(
  document: ManifestDocument,
  canvasId: CanvasId | null,
): boolean {
  return document.scans.some((scan) => scan.canvasId === canvasId);
}
