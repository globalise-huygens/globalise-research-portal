import { describe, expect, it } from 'vitest';
import { resolveManifestRoute } from './resolveManifestRoute';

const inventory = '/hdl:20.500.14722/inventory:1053';
const firstPage = `${inventory}/0003`;
const documentPath = `${inventory}/0003-0071`;
const document = { inventory: '1053', page: '0003', endPage: '0071' };

describe('document on its first page', () => {
  // /hdl:20.500.14722/inventory:1053/0003-0071
  it('selects the document and opens its first page', () => {
    const route = resolveManifestRoute(documentPath, {});
    expect(route).toEqual({ canvasPath: firstPage, document });
  });

  it('drops a query without search hit', () => {
    const route = resolveManifestRoute(documentPath, { q: 'Batavia' });
    expect(route).toEqual({ canvasPath: firstPage, document });
  });
});

describe('document with a search hit snippet', () => {
  // /hdl:20.500.14722/inventory:1053/0003-0071?q=…&snippet=…
  const query = { q: 'Batavia', ead: ['1.04.02'] };
  const search = { ...query, snippet: 's1' };

  it('requests the search hit by its snippet', () => {
    const route = resolveManifestRoute(documentPath, search);
    const target = { snippet: 's1' };
    const searchHit = { document, target };
    expect(route?.searchHit).toEqual(searchHit);
  });

  it('keeps the query and facets of the search hit', () => {
    const route = resolveManifestRoute(documentPath, search);
    const facets = { ead: ['1.04.02'] };
    expect(route?.searchHitQuery).toEqual({ query: 'Batavia', facets });
  });
});

describe('document with a search hit index', () => {
  // /hdl:20.500.14722/inventory:1053/0003-0071?q=…&hit-index=…
  const search = { q: 'Batavia', 'hit-index': 3 };

  it('requests the search hit by its index', () => {
    const route = resolveManifestRoute(documentPath, search);
    const target = { esHitIndex: 3 };
    const searchHit = { document, target };
    expect(route?.searchHit).toEqual(searchHit);
  });

  it('opens the first page of the document', () => {
    const route = resolveManifestRoute(documentPath, search);
    expect(route?.canvasPath).toBe(firstPage);
  });
});

describe('canvas and inventory paths', () => {
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
