import { describe, expect, it } from 'vitest';
import { toManifestRoute } from './toManifestRoute';

const page = { inventory: '1053', page: '0004' };
const document = { inventory: '1053', page: '0003', endPage: '0071' };
const searchHit = { document, hit: { snippet: 's1' } };
const searchHitQuery = { query: 'Batavia', facets: {} };
const noSearchHit = { searchHit: null, searchHitQuery: null, activeEsHitIndex: null };
const activeHit = { ref: document, searchHit, searchHitQuery, activeEsHitIndex: 3 };

describe(toManifestRoute.name, () => {
  it('routes to the active search hit by its index', () => {
    expect(toManifestRoute(activeHit)).toEqual({
      type: 'hit',
      searchHit: { document, hit: { esHitIndex: 3 } },
      searchHitQuery,
    });
  });

  it('routes to the first search hit', () => {
    expect(toManifestRoute({ ...activeHit, activeEsHitIndex: 0 }).type).toBe('hit');
  });

  it('routes to the document without a located search hit', () => {
    const route = toManifestRoute({ ...activeHit, activeEsHitIndex: null });
    expect(route).toEqual({ type: 'document', ref: document });
  });

  it('routes to the scan without search hit', () => {
    expect(toManifestRoute({ ref: page, ...noSearchHit }).type).toBe('scan');
  });
});
