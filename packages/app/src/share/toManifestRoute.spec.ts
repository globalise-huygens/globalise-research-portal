import { describe, expect, it } from 'vitest';
import { toManifestRoute } from './toManifestRoute';

const page = { inventory: '1053', page: '0004' };
const document = { inventory: '1053', page: '0003', endPage: '0071' };
const searchHit = { document, hit: { snippet: 's1' } };
const searchHitQuery = { query: 'Batavia', facets: {} };
const noSearchHit = { searchHit: null, searchHitQuery: null };
const withSearchHit = { ref: document, searchHit, searchHitQuery };

describe(toManifestRoute.name, () => {
  it('routes to the active search hit by its index', () => {
    expect(toManifestRoute(withSearchHit, 3)).toEqual({
      type: 'hit',
      searchHit: { document, hit: { hitIndex: 3 } },
      searchHitQuery,
    });
  });

  it('routes to the first search hit', () => {
    expect(toManifestRoute(withSearchHit, 0).type).toBe('hit');
  });

  it('routes to the document without a located search hit', () => {
    const route = toManifestRoute(withSearchHit, null);
    expect(route).toEqual({ type: 'document', ref: document });
  });

  it('routes to the scan without search hit', () => {
    expect(toManifestRoute({ ref: page, ...noSearchHit }, null).type).toBe('scan');
  });
});
