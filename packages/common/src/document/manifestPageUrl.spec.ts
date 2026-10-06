import { describe, expect, it } from 'vitest';
import { parseDocumentHit, toManifestHref } from './manifestPageUrl';

const canvasUrl = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/canvas:';
const documentHit = {
  startCanvasId: `${canvasUrl}NL-HaNA_1.04.02_1053_0013`,
  endCanvasId: `${canvasUrl}NL-HaNA_1.04.02_1053_0019`,
  startCharOffset: 27,
};

describe(parseDocumentHit.name, () => {
  it('spans first to last canvas of multi-page document, starting at hit offset', () => {
    const params = new URLSearchParams({ document: 'NL-HaNA_1.04.02_1053_0013-0019', hit: '27-34' });
    expect(parseDocumentHit(params)).toEqual(documentHit);
  });

  it('starts and ends at same canvas when single-page document', () => {
    const params = new URLSearchParams({ document: 'NL-HaNA_1.04.02_1053_0013', hit: '27-34' });
    const hit = parseDocumentHit(params);
    expect(hit?.startCanvasId).toBe(`${canvasUrl}NL-HaNA_1.04.02_1053_0013`);
    expect(hit?.endCanvasId).toBe(`${canvasUrl}NL-HaNA_1.04.02_1053_0013`);
  });

  it('starts at offset 0 without a hit', () => {
    const params = new URLSearchParams({ document: 'NL-HaNA_1.04.02_1053_0013-0019' });
    expect(parseDocumentHit(params)?.startCharOffset).toBe(0);
  });

  it('returns undefined without a document', () => {
    expect(parseDocumentHit(new URLSearchParams())).toBeUndefined();
  });
});

describe(toManifestHref.name, () => {
  it('links to manifest, with document and hit offsets', () => {
    const href = toManifestHref({ inventoryNumber: '1053', document: 'NL-HaNA_1.04.02_1053_0013-0019', hit: { start: 27, end: 34 } });
    const params = new URLSearchParams(href.split('?')[1]);
    expect(params.get('manifest')).toBe('https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/inventory:1053.manifest');
    expect(parseDocumentHit(params)).toEqual(documentHit);
  });

  it('links without hit offsets when no hit', () => {
    const href = toManifestHref({ inventoryNumber: '1053', document: 'NL-HaNA_1.04.02_1053_0013-0019', hit: null });
    expect(new URLSearchParams(href.split('?')[1]).has('hit')).toBe(false);
  });
});
