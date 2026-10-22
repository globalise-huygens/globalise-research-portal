export const MANIFEST = 'manifest';
export const CANVAS = 'canvas';
export const DOCUMENT = 'document';
export const DOCUMENT_ID = 'documentId';
export const SNIPPET = 'snippet';

const globaliseDataUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';

export function toManifestId(inventoryNumber: string): string {
  return `${globaliseDataUrl}inventory:${inventoryNumber}.manifest`;
}

export function toCanvasId(name: string): string {
  return `${globaliseDataUrl}canvas:${name}`;
}
