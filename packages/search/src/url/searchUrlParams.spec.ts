import { describe, expect, it } from 'vitest';
import { toSearchUrlParams, toSearchState } from './searchUrlParams';

describe(toSearchUrlParams.name, () => {
  it('maps the search state to url params, with its page', () => {
    const stateOnPage3 = { query: 'Batavia', facetValues: { ead: ['1.04.02'] }, page: 3 };
    const urlParams = toSearchUrlParams(stateOnPage3);
    expect(urlParams).toEqual({ q: 'Batavia', ead: ['1.04.02'], page: 3 });
  });

  it('leaves out the first page', () => {
    const urlParams = toSearchUrlParams({ query: 'Batavia', facetValues: {}, page: 1 });
    expect(urlParams.page).toBeUndefined();
  });
});

describe(toSearchState.name, () => {
  it('maps url params to the search state, on the first page', () => {
    const urlParams = { q: 'Batavia', ead: ['1.04.02'] };
    const state = toSearchState(urlParams);
    expect(state).toEqual({ query: 'Batavia', sort: undefined, facetValues: { ead: ['1.04.02'] }, page: 1 });
  });

  it('maps the page of the url params', () => {
    expect(toSearchState({ q: 'Batavia', page: 3 }).page).toBe(3);
  });
});
