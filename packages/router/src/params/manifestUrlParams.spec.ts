import { describe, expect, it } from 'vitest';
import { type ManifestUrlParams, resetUrlParamsOnManifestChange, validateManifestUrlParams } from './manifestUrlParams.ts';

describe(validateManifestUrlParams.name, () => {
  it('keeps manifest params and search context, dropping unknown params', () => {
    const urlParams = { manifest: 'm1', canvas: 'c1', q: 'Batavia', uri: 'u1' };
    const validated = validateManifestUrlParams(urlParams);
    expect(validated).toEqual({ manifest: 'm1', canvas: 'c1', q: 'Batavia' });
  });
});

describe(resetUrlParamsOnManifestChange.name, () => {
  const current = { manifest: 'm1', canvas: 'c1', document: 'd1', q: 'Batavia' };

  function navigateTo(next: ManifestUrlParams) {
    return resetUrlParamsOnManifestChange({ search: current, next: () => next });
  }

  it('drops the old canvas and document when the manifest changes', () => {
    const otherManifest = { ...current, manifest: 'm2' };
    expect(navigateTo(otherManifest)).toEqual({ manifest: 'm2', q: 'Batavia' });
  });

  it('keeps a canvas and document that come with the new manifest', () => {
    const otherManifestWithCanvas = { manifest: 'm2', canvas: 'c2', document: 'd2' };
    expect(navigateTo(otherManifestWithCanvas)).toEqual(otherManifestWithCanvas);
  });

  it('keeps everything within the same manifest', () => {
    const otherCanvas = { ...current, canvas: 'c2' };
    expect(navigateTo(otherCanvas)).toEqual(otherCanvas);
  });
});
