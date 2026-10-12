import { describe, expect, it } from 'vitest';
import { toDocumentHit, toManifestHref } from './manifestPageUrl';

const canvasUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/canvas:';

describe(toDocumentHit.name, () => {
  it('spans first to last canvas of multi-page document, starting at hit offset', () => {
    expect(toDocumentHit('NL-HaNA_1.04.02_1053_0013-0019', 27)).toEqual({
      startCanvasId: `${canvasUrl}NL-HaNA_1.04.02_1053_0013`,
      endCanvasId: `${canvasUrl}NL-HaNA_1.04.02_1053_0019`,
      startCharOffset: 27,
    });
  });

  it('starts and ends at same canvas when single-page document', () => {
    const hit = toDocumentHit('NL-HaNA_1.04.02_1053_0013', 27);
    expect(hit.startCanvasId).toBe(`${canvasUrl}NL-HaNA_1.04.02_1053_0013`);
    expect(hit.endCanvasId).toBe(`${canvasUrl}NL-HaNA_1.04.02_1053_0013`);
  });
});

describe(toManifestHref.name, () => {
  it('links to manifest with document and snippet, keeping the search params', () => {
    const href = toManifestHref({
      inventoryNumber: '1053',
      document: 'NL-HaNA_1.04.02_1053_0013-0019',
      documentId: 'doc-1',
      snippet: 'schip van Batavia',
      search: '?q=Batavia',
    });
    const params = new URLSearchParams(href.split('?')[1]);
    expect(Object.fromEntries(params)).toEqual({
      q: 'Batavia',
      manifest: 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/inventory:1053.manifest',
      document: 'NL-HaNA_1.04.02_1053_0013-0019',
      documentId: 'doc-1',
      snippet: 'schip van Batavia',
    });
  });
});
