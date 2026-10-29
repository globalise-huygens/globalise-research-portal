import { describe, expect, it } from 'vitest';
import { toDocumentHit } from './documentIds';

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
