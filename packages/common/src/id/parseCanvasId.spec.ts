import { describe, expect, it } from 'vitest';
import { parseCanvasId } from './parseCanvasId';

describe(parseCanvasId.name, () => {
  // future: https://id.globalise.nl/hdl:20.500.14722
  const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

  const canvas = `${handle}/canvas:NL-HaNA_1.04.02_1053_0004`;
  const canvasPostfixed = `${handle}/canvas:NL-HaNA_1.04.02_9817_P01`;
  const textPage = `${handle}/annotations:text:NL-HaNA_1.04.02_1053_0004`;

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
