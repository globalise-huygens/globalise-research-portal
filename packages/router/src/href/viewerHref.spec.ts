import { describe, expect, it } from 'vitest';
import { handle, idBase } from '@globalise/common/uri';
import { toCanvasHref, toManifestHref, toViewerHref } from './viewerHref.ts';

describe(toViewerHref.name, () => {
  it('builds the viewer path with its url params', () => {
    const page = { inventory: '1053', page: '0004' };
    const href = toViewerHref(page, { q: 'Batavia' });
    expect(href).toBe(`/${handle}/inventory:1053/0004?q=Batavia`);
  });
});

describe(toCanvasHref.name, () => {

  it('builds the viewer path of the scan of a canvas', () => {
    const canvas = `${idBase}/canvas:NL-HaNA_1.04.02_1053_0004`;
    const href = toCanvasHref(canvas, { q: 'Batavia' });
    expect(href).toBe(`/${handle}/inventory:1053/0004?q=Batavia`);
  });

  it('builds nothing for other ids', () => {
    const manifest = `${idBase}/inventory:1053.manifest`;
    expect(toCanvasHref(manifest, {})).toBeUndefined();
  });
});

describe(toManifestHref.name, () => {

  it('builds the viewer path of the inventory of a manifest', () => {
    const manifest = `${idBase}/inventory:1171A.manifest`;
    const href = toManifestHref(manifest, { q: 'Batavia' });
    expect(href).toBe(`/${handle}/inventory:1171A?q=Batavia`);
  });

  it('builds nothing for other id types', () => {
    const canvas = `${idBase}/canvas:NL-HaNA_1.04.02_1053_0004`;
    expect(toManifestHref(canvas, {})).toBeUndefined();
  });
});
