import { describe, expect, it } from 'vitest';
import { collectSharableRouteState } from './collectSharableRouteState.ts';

const firstPage = { inventory: '1053', page: '0003' };
const document = { ...firstPage, endPage: '0071' };
const searchHit = { document, hit: { snippet: 's1' } };
const searchHitQuery = { query: 'Batavia', facets: {} };
const noSearchHit = {
  searchHit: null,
  searchHitQuery: null,
  activeEsHitIndex: null,
};
const selected = { selectedDocument: document, ...noSearchHit };
const stored = { ...selected, searchHit, searchHitQuery, activeEsHitIndex: 3 };

describe(collectSharableRouteState.name, () => {
  it('views the selected document while on its first page', () => {
    expect(collectSharableRouteState(firstPage, selected).ref).toBe(document);
  });

  it('views the page once scrolled to another page', () => {
    const otherPage = { inventory: '1053', page: '0004' };
    expect(collectSharableRouteState(otherPage, selected).ref).toBe(otherPage);
  });

  it('views the page without a selected document', () => {
    const state = collectSharableRouteState(firstPage, noSearchHit);
    expect(state.ref).toBe(firstPage);
  });

  it('views the document of the search hit, wherever scrolled', () => {
    const otherPage = { inventory: '1053', page: '0010' };
    const state = collectSharableRouteState(otherPage, stored);
    const { selectedDocument, ...activeHit } = stored;
    expect(state).toEqual({ ref: selectedDocument, ...activeHit });
  });

  it('ignores the document and search hit of another inventory', () => {
    const otherInventory = { inventory: '1171A', page: '0003' };
    expect(collectSharableRouteState(otherInventory, stored)).toEqual({
      ref: otherInventory,
      searchHit: null,
      searchHitQuery: null,
      activeEsHitIndex: null,
    });
  });
});
