import { describe, expect, it } from 'vitest';
import { createCanvasId, parseCanvasId, parseCanvasName } from './canvasId';

// future: https://id.globalise.nl/hdl:20.500.14722
const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

const canvas = `${handle}/canvas:NL-HaNA_1.04.02_1053_0004`;
const canvasPostfixed = `${handle}/canvas:NL-HaNA_1.04.02_9817_P01`;
const textPage = `${handle}/annotations:text:NL-HaNA_1.04.02_1053_0004`;

describe(parseCanvasId.name, () => {
  it('reads the inventory and page of a canvas', () => {
    const page = parseCanvasId(canvas);
    expect(page).toEqual({ inventory: '1053', page: '0004' });
  });

  it('reads a page with a letter', () => {
    const page = parseCanvasId(canvasPostfixed);
    expect(page).toEqual({ inventory: '9817', page: 'P01' });
  });

  it('ignores the text annotation page of a canvas', () => {
    expect(parseCanvasId(textPage)).toBeUndefined();
  });
});

describe(parseCanvasName.name, () => {
  it('reads the inventory and page of a canvas name', () => {
    const page = parseCanvasName('NL-HaNA_1.04.02_1053_0004');
    expect(page).toEqual({ inventory: '1053', page: '0004' });
  });
});

describe(createCanvasId.name, () => {
  it('builds the canvas id of a scan', () => {
    const page = { inventory: '1053', page: '0004' };
    expect(createCanvasId(page)).toBe(canvas);
  });

  it('builds the canvas id of the scan a document starts on', () => {
    const document = { inventory: '1053', page: '0004', endPage: '0067' };
    expect(createCanvasId(document)).toBe(canvas);
  });

  it('builds the canvas id of the scan of an annotation', () => {
    const page = { inventory: '1053', page: '0004' };
    const entity = { ...page, fragment: 'person:000074' };
    expect(createCanvasId(entity)).toBe(canvas);
  });
});
