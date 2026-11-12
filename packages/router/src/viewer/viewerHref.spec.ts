import { describe, expect, it } from 'vitest';
import { toCanvasHref, toManifestHref, toViewerHref } from './viewerHref.ts';

describe(toViewerHref.name, () => {
  it('builds the viewer path with its url params', () => {
    const page = { inventory: '1053', page: '0004' };
    const href = toViewerHref(page, { q: 'Batavia' });
    expect(href).toBe('/hdl:20.500.14722/inventory:1053/0004?q=Batavia');
  });
});

describe(toCanvasHref.name, () => {
  const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

  it('builds the viewer path of the scan of a canvas', () => {
    const canvas = `${handle}/canvas:NL-HaNA_1.04.02_1053_0004`;
    const href = toCanvasHref(canvas, { q: 'Batavia' });
    expect(href).toBe('/hdl:20.500.14722/inventory:1053/0004?q=Batavia');
  });

  it('builds nothing for other ids', () => {
    const manifest = `${handle}/inventory:1053.manifest`;
    expect(toCanvasHref(manifest, {})).toBeUndefined();
  });
});

describe(toManifestHref.name, () => {
  const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

  it('builds the viewer path of the inventory of a manifest', () => {
    const manifest = `${handle}/inventory:1171A.manifest`;
    const href = toManifestHref(manifest, { manifest });
    expect(href).toMatch(/^\/hdl:20\.500\.14722\/inventory:1171A\?manifest=/u);
  });

  it('builds nothing for other id types', () => {
    const canvas = `${handle}/canvas:NL-HaNA_1.04.02_1053_0004`;
    expect(toManifestHref(canvas, {})).toBeUndefined();
  });
});
