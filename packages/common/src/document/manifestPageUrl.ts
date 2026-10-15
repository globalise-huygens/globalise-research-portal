export const MANIFEST = 'manifest';
export const CANVAS = 'canvas';
export const DOCUMENT = 'document';
export const DOCUMENT_ID = 'documentId';
export const SNIPPET = 'snippet';

const globaliseDataUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';

export type ManifestHrefParams = {
  inventoryNumber: string;
  document: string;
  documentId: string;
  snippet: string;
  search: string;
};

export function toManifestHref({ inventoryNumber, document, documentId, snippet, search }: ManifestHrefParams): string {
  const params = new URLSearchParams(search);
  params.set(MANIFEST, toManifestId(inventoryNumber));
  params.set(DOCUMENT, document);
  params.set(DOCUMENT_ID, documentId);
  params.set(SNIPPET, snippet);
  return `/manifest?${params}`;
}

export function toManifestId(inventoryNumber: string): string {
  return `${globaliseDataUrl}inventory:${inventoryNumber}.manifest`;
}

export function toCanvasId(name: string): string {
  return `${globaliseDataUrl}canvas:${name}`;
}
