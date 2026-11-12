import { describe, expect, it } from 'vitest';
import {
  findViewerPath,
  type ManifestUrlParams,
  resetUrlParamsOnManifestChange,
  validateManifestUrlParams,
} from './manifestUrlParams.ts';

describe(validateManifestUrlParams.name, () => {
  it('keeps manifest params and search context, dropping unknown params', () => {
    const urlParams = { manifest: 'm1', canvas: 'c1', q: 'Batavia', uri: 'u1' };
    const validated = validateManifestUrlParams(urlParams);
    expect(validated).toEqual({ manifest: 'm1', canvas: 'c1', q: 'Batavia' });
  });
});

describe(findViewerPath.name, () => {
  const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';
  const viewer = '/hdl:20.500.14722/inventory';

  it('opens the scan of the canvas', () => {
    const manifest = `${handle}/inventory:1053.manifest`;
    const canvas = `${handle}/canvas:NL-HaNA_1.04.02_1053_0004`;
    expect(findViewerPath({ manifest, canvas })).toBe(`${viewer}:1053/0004`);
  });

  it('opens the inventory of the manifest without a canvas', () => {
    const manifest = `${handle}/inventory:1171A.manifest`;
    expect(findViewerPath({ manifest })).toBe(`${viewer}:1171A`);
  });

  it('opens the default inventory without a manifest', () => {
    expect(findViewerPath({})).toBe(`${viewer}:1053`);
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
