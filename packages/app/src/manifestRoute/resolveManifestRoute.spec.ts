import { describe, expect, it } from 'vitest';
import { resolveManifestRoute } from './resolveManifestRoute';

const inventory = '/hdl:20.500.14722/inventory:1053';

describe(resolveManifestRoute.name, () => {
  it('selects the document of a document path and opens its first page', () => {
    const route = resolveManifestRoute(`${inventory}/0003-0071`);
    expect(route).toEqual({
      document: { inventory: '1053', page: '0003', endPage: '0071' },
      canvasPath: `${inventory}/0003`,
    });
  });

  it('resolves nothing on a canvas path', () => {
    expect(resolveManifestRoute(`${inventory}/0004`)).toBeUndefined();
  });

  it('resolves nothing on an inventory path', () => {
    expect(resolveManifestRoute(inventory)).toBeUndefined();
  });
});
