import { describe, expect, it } from 'vitest';
import { handle, parseViewerSplat } from '@globalise/common/uri';
import { validateManifestUrlParams } from '@globalise/router';
import { type ManifestRoute, parseManifestRoute } from './ManifestRoute';
import { createSharableHref } from './createSharableHref';

const inventoryPath = '/hdl:20.500.14722/inventory:1053';
const inventory = { inventory: '1053' };
const page = { inventory: '1053', page: '0004' };
const document = { inventory: '1053', page: '0003', endPage: '0071' };
const searchHitQuery = { query: 'Batavia', facets: { ead: ['1.04.02'] } };

const routes: Record<ManifestRoute['type'], ManifestRoute> = {
  inventory: { type: 'inventory', ref: inventory, searchHitQuery },
  scan: { type: 'scan', ref: page },
  document: { type: 'document', ref: document },
  hit: { type: 'hit', searchHit: { document, hit: { hitIndex: 3 } }, searchHitQuery },
};

describe(createSharableHref.name, () => {
  it('shares an inventory with its query', () => {
    const search = '?q=Batavia&ead=1.04.02';
    expect(createSharableHref(routes.inventory)).toBe(`${inventoryPath}${search}`);
  });

  it('shares a scan', () => {
    expect(createSharableHref(routes.scan)).toBe(`${inventoryPath}/0004`);
  });

  it('shares a document', () => {
    expect(createSharableHref(routes.document)).toBe(`${inventoryPath}/0003-0071`);
  });

  it('shares a search hit by its index', () => {
    const search = '?q=Batavia&ead=1.04.02&hit-index=3';
    expect(createSharableHref(routes.hit)).toBe(`${inventoryPath}/0003-0071${search}`);
  });

  it('shares a search hit by its snippet', () => {
    const hit = { ...routes.hit, searchHit: { document, hit: { snippet: 's1' } } };
    expect(createSharableHref(hit)).toMatch(/&snippet=s1$/u);
  });

  it.each(Object.values(routes))('resolves a shared $type back to the same route', (route) => {
    expect(parseHref(createSharableHref(route))).toEqual(route);
  });
});

function parseHref(href: string): ManifestRoute {
  const { pathname, searchParams } = new URL(href, 'https://foo.bar');
  const ref = parseViewerSplat(pathname.slice(`/${handle}/`.length)) ?? inventory;
  return parseManifestRoute(ref, validateManifestUrlParams(Object.fromEntries(searchParams)));
}
