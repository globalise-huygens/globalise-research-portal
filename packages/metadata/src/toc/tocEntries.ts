import type { CanvasId } from '@globalise/common/document';
import type { ManifestDocument } from './toToc';

export function findCurrentDocument(
  documents: ManifestDocument[], canvasId: CanvasId | null, preferredDocumentId?: string,
): ManifestDocument | undefined {
  const containsScan = (document: ManifestDocument) => document.scans.some((scan) => scan.canvasId === canvasId);
  return documents.find((document) => document.id === preferredDocumentId && containsScan(document))
    ?? documents.find(containsScan);
}
