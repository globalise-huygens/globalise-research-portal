import { describe, expect, it } from 'vitest';
import { validateManifestUrlParams } from './manifestUrlParams.ts';

describe(validateManifestUrlParams.name, () => {
  it('keeps manifest params and search context, dropping unknown params', () => {
    const urlParams = { manifest: 'm1', canvas: 'c1', q: 'Batavia', uri: 'u1' };
    const validated = validateManifestUrlParams(urlParams);
    expect(validated).toEqual({ canvas: 'c1', q: 'Batavia' });
  });
});
