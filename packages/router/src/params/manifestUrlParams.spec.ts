import { describe, expect, it } from 'vitest';
import { validateManifestUrlParams } from './manifestUrlParams.ts';

describe(validateManifestUrlParams.name, () => {
  it('keeps the search hit and search context, dropping unknown params', () => {
    const urlParams = { canvas: 'c1', snippet: 's1', q: 'Batavia' };
    const validated = validateManifestUrlParams(urlParams);
    expect(validated).toEqual({ snippet: 's1', q: 'Batavia' });
  });

  it('reads the hit index as a number', () => {
    const validated = validateManifestUrlParams({ 'hit-index': '3' });
    expect(validated['hit-index']).toBe(3);
  });

  it('drops a hit index that is no index', () => {
    const validated = validateManifestUrlParams({ 'hit-index': '-1' });
    expect(validated['hit-index']).toBeUndefined();
  });
});
