import { describe, expect, it } from 'vitest';
import { resolveManifestRoute } from './resolveManifestRoute';

const inventoryPath = '/hdl:20.500.14722/inventory:1053';
const firstPage = `${inventoryPath}/0003`;
const inventory = { inventory: '1053' };
const page = { inventory: '1053', page: '0004' };
const document = { inventory: '1053', page: '0003', endPage: '0071' };

describe('document on its first page', () => {
  // /hdl:20.500.14722/inventory:1053/0003-0071
  it('selects the document and opens its first page', () => {
    const route = resolveManifestRoute(document, {});
    expect(route).toEqual({ canvasPath: firstPage, document });
  });

  it('drops a query without search hit', () => {
    const route = resolveManifestRoute(document, { q: 'Batavia' });
    expect(route).toEqual({ canvasPath: firstPage, document });
  });
});

describe('document with a search hit snippet', () => {
  // /hdl:20.500.14722/inventory:1053/0003-0071?q=…&snippet=…
  const query = { q: 'Batavia', ead: ['1.04.02'] };
  const search = { ...query, snippet: 's1' };

  it('requests the search hit by its snippet', () => {
    const route = resolveManifestRoute(document, search);
    const target = { snippet: 's1' };
    const searchHit = { document, target };
    expect(route.searchHit).toEqual(searchHit);
  });

  it('keeps the query and facets of the search hit', () => {
    const route = resolveManifestRoute(document, search);
    const facets = { ead: ['1.04.02'] };
    expect(route.searchHitQuery).toEqual({ query: 'Batavia', facets });
  });
});

describe('document with a search hit index', () => {
  // /hdl:20.500.14722/inventory:1053/0003-0071?q=…&hit-index=…
  const search = { q: 'Batavia', 'hit-index': 3 };

  it('requests the search hit by its index', () => {
    const route = resolveManifestRoute(document, search);
    const target = { esHitIndex: 3 };
    const searchHit = { document, target };
    expect(route.searchHit).toEqual(searchHit);
  });

  it('opens the first page of the document', () => {
    const route = resolveManifestRoute(document, search);
    expect(route.canvasPath).toBe(firstPage);
  });
});

describe('canvas and inventory paths', () => {
  it('keeps the query of a canvas path', () => {
    const route = resolveManifestRoute(page, { q: 'Batavia' });
    const facets = {};
    expect(route).toEqual({
      canvasPath: `${inventoryPath}/0004`,
      searchHitQuery: { query: 'Batavia', facets },
    });
  });

  it('keeps a canvas path as is', () => {
    const route = resolveManifestRoute(page, {});
    expect(route).toEqual({ canvasPath: `${inventoryPath}/0004` });
  });

  it('keeps an inventory path as is', () => {
    const route = resolveManifestRoute(inventory, {});
    expect(route).toEqual({ canvasPath: inventoryPath });
  });
});
