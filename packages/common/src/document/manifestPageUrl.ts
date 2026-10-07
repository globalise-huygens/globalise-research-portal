import type { CanvasId } from './ManifestViewerSlice';

export const MANIFEST = 'manifest';
export const CANVAS = 'canvas';
export const DOCUMENT = 'document';
export const HIT = 'hit';

const globaliseDataUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';

export type DocumentHit = {
  startCanvasId: CanvasId;
  endCanvasId: CanvasId;
  startCharOffset: number;
};

export type ManifestHrefParams = {
  inventoryNumber: string;
  document: string;
  hit: { start: number; end: number } | null;
};

export function toManifestHref({ inventoryNumber, document, hit }: ManifestHrefParams): string {
  const params = new URLSearchParams({
    [MANIFEST]: toManifestId(inventoryNumber),
    [DOCUMENT]: document,
  });
  if (hit) {
    params.set(HIT, `${hit.start}-${hit.end}`);
  }
  return `/manifest?${params}`;
}

export function parseDocumentHit(params: URLSearchParams): DocumentHit | undefined {
  const document = params.get(DOCUMENT);
  if (!document) {
    return;
  }
  const startCanvasName = document.replace(/-\d+$/u, '');
  const endPage = /-(\d+)$/u.exec(document)?.[1];
  const endCanvasName = endPage ? startCanvasName.replace(/\d+$/u, endPage) : startCanvasName;
  const [start] = (params.get(HIT) ?? '0').split('-');
  return {
    startCanvasId: toCanvasId(startCanvasName),
    endCanvasId: toCanvasId(endCanvasName),
    startCharOffset: Number(start),
  };
}

export function toManifestId(inventoryNumber: string): string {
  return `${globaliseDataUrl}inventory:${inventoryNumber}.manifest`;
}

export function toCanvasId(name: string): string {
  return `${globaliseDataUrl}canvas:${name}`;
}
