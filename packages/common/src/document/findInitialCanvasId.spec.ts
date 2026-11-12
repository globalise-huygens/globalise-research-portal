import { describe, expect, it } from 'vitest';
import { findInitialCanvasId } from './findInitialCanvasId';
import { createCanvasId } from '../uri';

const document = 'NL-HaNA_1.04.02_1053_0003-0071';
const documentStart = { inventory: '1053', page: '0003' };
const documentStartCanvasId = createCanvasId(documentStart);

describe(findInitialCanvasId.name, () => {
  it('prefers the canvas from the url', () => {
    const canvas = findInitialCanvasId({ canvas: 'url', document }, 'hit');
    expect(canvas).toBe('url');
  });

  it('uses the canvas of the active hit when the url has no canvas', () => {
    expect(findInitialCanvasId({ document }, 'hit')).toBe('hit');
  });

  it('uses the first page of the document without an active hit', () => {
    expect(findInitialCanvasId({ document })).toBe(documentStartCanvasId);
  });

  it('uses the page of a single page document', () => {
    const singlePage = 'NL-HaNA_1.04.02_1053_0003-0003';
    const canvas = findInitialCanvasId({ document: singlePage });
    expect(canvas).toBe(documentStartCanvasId);
  });

  it('finds no canvas without url canvas, active hit and document', () => {
    expect(findInitialCanvasId({})).toBeUndefined();
  });
});
