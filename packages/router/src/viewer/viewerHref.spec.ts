import { describe, expect, it } from 'vitest';
import { findViewerPath, toCanvasHref, toViewerHref } from './viewerHref.ts';

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
