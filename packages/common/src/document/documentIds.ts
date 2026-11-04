import type { CanvasId } from './ManifestViewerSlice';

const globaliseDataUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';

export function findInitialCanvasId(
  { canvas, document }: { canvas?: CanvasId; document?: string },
  activeHitCanvasId?: CanvasId,
): CanvasId | undefined {
  if (canvas) {
    return canvas;
  }
  if (activeHitCanvasId) {
    return activeHitCanvasId;
  }
  if (document) {
    return toDocumentStartCanvasId(document);
  }
  return undefined;
}

export function toManifestId(inventoryNumber: string): string {
  return `${globaliseDataUrl}inventory:${inventoryNumber}.manifest`;
}

export function toCanvasId(name: string): string {
  return `${globaliseDataUrl}canvas:${name}`;
}

function toDocumentStartCanvasId(document: string): CanvasId {
  return toCanvasId(document.replace(/-\d+$/u, ''));
}
