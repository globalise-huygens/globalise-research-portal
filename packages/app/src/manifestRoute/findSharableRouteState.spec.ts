import { describe, expect, it } from 'vitest';
import { collectSharableRouteState } from './collectSharableRouteState.ts';

const firstPage = { inventory: '1053', page: '0003' };
const document = { ...firstPage, endPage: '0071' };
const searchHit = { document, docEsId: 'd1', snippet: 's1' };
const searchHitQuery = { query: 'Batavia', facets: {} };
const stored = { selectedDocument: document, searchHit, searchHitQuery };

describe(collectSharableRouteState.name, () => {
  it('views the selected document while on its first page', () => {
    expect(collectSharableRouteState(firstPage, stored).ref).toBe(document);
  });

  it('views the page once scrolled to another page', () => {
    const otherPage = { inventory: '1053', page: '0004' };
    expect(collectSharableRouteState(otherPage, stored).ref).toBe(otherPage);
  });

  it('views the page without a selected document', () => {
    const withoutDocument = { searchHit: null, searchHitQuery: null };
    const state = collectSharableRouteState(firstPage, withoutDocument);
    expect(state.ref).toBe(firstPage);
  });

  it('keeps the search hit within its inventory', () => {
    const otherPage = { inventory: '1053', page: '0004' };
    const state = collectSharableRouteState(otherPage, stored);
    expect(state).toMatchObject({ searchHit, searchHitQuery });
  });

  it('ignores the document and search hit of another inventory', () => {
    const otherInventory = { inventory: '1171A', page: '0003' };
    expect(collectSharableRouteState(otherInventory, stored)).toEqual({
      ref: otherInventory,
      searchHit: null,
      searchHitQuery: null,
    });
  });
});
