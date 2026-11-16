import { describe, expect, it } from 'vitest';
import { createSharableHref } from './createSharableHref';

const inventory = '/hdl:20.500.14722/inventory:1053';
const document = { inventory: '1053', page: '0003', endPage: '0071' };
const searchHit = { document, target: { snippet: 's1' } };
const searchHitQuery = { query: 'Batavia', facets: { ead: ['1.04.02'] } };
const noSearchHit = { searchHit: null, searchHitQuery: null };
const activeHit = { searchHit, searchHitQuery, activeEsHitIndex: 3 };

describe(createSharableHref.name, () => {
  it('shares the document while on its first page', () => {
    const state = { ref: document, ...noSearchHit, activeEsHitIndex: null };
    expect(createSharableHref(state)).toBe(`${inventory}/0003-0071`);
  });

  it('shares a page without search hit', () => {
    const page = { inventory: '1053', page: '0004' };
    const state = { ref: page, ...noSearchHit, activeEsHitIndex: null };
    expect(createSharableHref(state)).toBe(`${inventory}/0004`);
  });

  it('shares the active hit of the document by its index', () => {
    const state = { ref: document, ...activeHit };
    const search = '?q=Batavia&ead=1.04.02&hit-index=3';
    expect(createSharableHref(state)).toBe(`${inventory}/0003-0071${search}`);
  });

  it('shares the first hit of the document', () => {
    const state = { ref: document, ...activeHit, activeEsHitIndex: 0 };
    expect(createSharableHref(state)).toMatch(/&hit-index=0$/u);
  });

  it('shares the document without a located hit', () => {
    const state = { ref: document, ...activeHit, activeEsHitIndex: null };
    expect(createSharableHref(state)).toBe(`${inventory}/0003-0071`);
  });
});
