import type { CanvasId } from './ManifestViewerSlice';

const globaliseDataUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';

export type DocumentHit = {
  startCanvasId: CanvasId;
  endCanvasId: CanvasId;
  startCharOffset: number;
};

export function toDocumentHit(
  document: string,
  startCharOffset: number,
): DocumentHit {
  const startCanvasName = document.replace(/-\d+$/u, '');
  const endPage = /-(\d+)$/u.exec(document)?.[1];
  const endCanvasName = endPage ? startCanvasName.replace(/\d+$/u, endPage) : startCanvasName;
  return {
    startCanvasId: toCanvasId(startCanvasName),
    endCanvasId: toCanvasId(endCanvasName),
    startCharOffset,
  };
}

export function toManifestId(inventoryNumber: string): string {
  return `${globaliseDataUrl}inventory:${inventoryNumber}.manifest`;
}

export function toCanvasId(name: string): string {
  return `${globaliseDataUrl}canvas:${name}`;
}
