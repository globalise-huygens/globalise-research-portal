import { describe, expect, it } from 'vitest';
import { findInitialCanvasId, toCanvasId, toDocumentId } from './documentIds';

const document = 'NL-HaNA_1.04.02_1053_0003-0071';
const documentStartCanvasId = toCanvasId('NL-HaNA_1.04.02_1053_0003');

describe(toDocumentId.name, () => {
  it('builds the document id from its name', () => {
    const id = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/document:';
    expect(toDocumentId(document)).toBe(`${id}${document}`);
  });
});

describe(findInitialCanvasId.name, () => {
  it('prefers the canvas from the url', () => {
    expect(findInitialCanvasId({ canvas: 'url', document }, 'hit')).toBe('url');
  });

  it('uses the canvas of the active hit when the url has no canvas', () => {
    expect(findInitialCanvasId({ document }, 'hit')).toBe('hit');
  });

  it('falls back to the first page of the document without an active hit', () => {
    expect(findInitialCanvasId({ document })).toBe(documentStartCanvasId);
  });

  it('uses the page of a single page document', () => {
    expect(findInitialCanvasId({ document: 'NL-HaNA_1.04.02_1053_0003' })).toBe(documentStartCanvasId);
  });

  it('finds no canvas without url canvas, active hit and document', () => {
    expect(findInitialCanvasId({})).toBeUndefined();
  });
});
