import { describe, expect, it } from 'vitest';
import { validateManifestUrlParams } from './manifestUrlParams.ts';

describe(validateManifestUrlParams.name, () => {
  it('keeps the search hit and search context, dropping unknown params', () => {
    const urlParams = { canvas: 'c1', documentId: 'd1', q: 'Batavia' };
    const validated = validateManifestUrlParams(urlParams);
    expect(validated).toEqual({ documentId: 'd1', q: 'Batavia' });
  });
});
