import { describe, expect, it } from 'vitest';
import { validateSearchUrlParams } from './searchUrlParams.ts';

describe(validateSearchUrlParams.name, () => {
  it('keeps query, sort and facets, dropping unknown params', () => {
    const urlParams = { q: 'Batavia', sort: 'date', ead: ['1.04.02'], canvas: 'c1' };
    const validated = validateSearchUrlParams(urlParams);
    expect(validated).toEqual({ q: 'Batavia', sort: 'date', ead: ['1.04.02'] });
  });

  it('reads a single facet value as a list', () => {
    const validated = validateSearchUrlParams({ profession: 'schipper' });
    expect(validated.profession).toEqual(['schipper']);
  });

  it('reads a numeric query as text', () => {
    const validated = validateSearchUrlParams({ q: 1053 });
    expect(validated.q).toBe('1053');
  });
});
