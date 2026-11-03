import { describe, expect, it } from 'vitest';
import { toSearchUrlParams, toSearchState } from './searchUrlParams';

describe(toSearchUrlParams.name, () => {
  it('maps the search state to url params, without page', () => {
    const stateOnPage3 = { query: 'Batavia', facetValues: { ead: ['1.04.02'] }, page: 3 };
    const urlParams = toSearchUrlParams(stateOnPage3);
    expect(urlParams).toEqual({ q: 'Batavia', sort: undefined, ead: ['1.04.02'] });
  });
});

describe(toSearchState.name, () => {
  it('maps url params to the search state, on the first page', () => {
    const urlParams = { q: 'Batavia', ead: ['1.04.02'] };
    const state = toSearchState(urlParams);
    expect(state).toEqual({ query: 'Batavia', sort: undefined, facetValues: { ead: ['1.04.02'] }, page: 1 });
  });
});
