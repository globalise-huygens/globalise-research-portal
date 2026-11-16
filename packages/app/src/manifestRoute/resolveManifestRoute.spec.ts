import { describe, expect, it } from 'vitest';
import { resolveManifestRoute } from './resolveManifestRoute';

const inventory = '/hdl:20.500.14722/inventory:1053';
const documentPath = `${inventory}/0003-0071`;
const document = { inventory: '1053', page: '0003', endPage: '0071' };

describe(resolveManifestRoute.name, () => {
  it('selects the document of a document path and opens its first page', () => {
    const route = resolveManifestRoute(documentPath, {});
    expect(route).toEqual({ canvasPath: `${inventory}/0003`, document });
  });

  it('requests the search hit of a document', () => {
    const search = { documentId: 'd1', snippet: 's1' };
    const route = resolveManifestRoute(documentPath, search);
    const searchHit = { document, docEsId: 'd1', snippet: 's1' };
    expect(route?.searchHit).toEqual(searchHit);
  });

  it('keeps the query and facets as search context', () => {
    const search = { q: 'Batavia', ead: ['1.04.02'] };
    const route = resolveManifestRoute(documentPath, search);
    const facets = { ead: ['1.04.02'] };
    expect(route?.searchContext).toEqual({ query: 'Batavia', facets });
  });

  it('strips the search params of a canvas path', () => {
    const route = resolveManifestRoute(`${inventory}/0004`, { q: 'Batavia' });
    expect(route?.canvasPath).toBe(`${inventory}/0004`);
  });

  it('resolves nothing on a canvas path', () => {
    expect(resolveManifestRoute(`${inventory}/0004`, {})).toBeUndefined();
  });

  it('resolves nothing on an inventory path', () => {
    expect(resolveManifestRoute(inventory, {})).toBeUndefined();
  });
});
