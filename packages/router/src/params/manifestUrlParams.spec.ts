import { describe, expect, it } from 'vitest';
import { validateManifestUrlParams } from './manifestUrlParams.ts';

describe(validateManifestUrlParams.name, () => {
  it('keeps the document and search context, dropping unknown params', () => {
    const urlParams = { canvas: 'c1', document: 'd1', q: 'Batavia' };
    const validated = validateManifestUrlParams(urlParams);
    expect(validated).toEqual({ document: 'd1', q: 'Batavia' });
  });
});
