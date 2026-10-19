import { describe, expect, it } from 'vitest';
import { toSearchSearch, toSearchState, validateSearchSearch } from './searchSearch';

describe(validateSearchSearch.name, () => {
  it('keeps query, sort and facets, dropping unknown params', () => {
    expect(validateSearchSearch({ q: 'Batavia', sort: 'date', ead: ['1.04.02'], canvas: 'c1' })).toEqual({
      q: 'Batavia',
      sort: 'date',
      ead: ['1.04.02'],
    });
  });

  it('reads a single facet value as a list', () => {
    expect(validateSearchSearch({ profession: 'schipper' }).profession).toEqual(['schipper']);
  });

  it('reads a numeric query as text', () => {
    expect(validateSearchSearch({ q: 1053 }).q).toBe('1053');
  });
});

describe(toSearchSearch.name, () => {
  it('maps the search state to url params, without page', () => {
    const state = { query: 'Batavia', facetValues: { ead: ['1.04.02'] }, page: 3 };
    expect(toSearchSearch(state)).toEqual({ q: 'Batavia', sort: undefined, ead: ['1.04.02'] });
  });
});

describe(toSearchState.name, () => {
  it('maps url params to the search state, on the first page', () => {
    expect(toSearchState({ q: 'Batavia', ead: ['1.04.02'] })).toEqual({
      query: 'Batavia',
      sort: undefined,
      facetValues: { ead: ['1.04.02'] },
      page: 1,
    });
  });
});
