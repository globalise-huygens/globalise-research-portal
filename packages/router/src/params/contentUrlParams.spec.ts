import { describe, expect, it } from 'vitest';
import { validateContentUrlParams } from './contentUrlParams.ts';

describe(validateContentUrlParams.name, () => {
  it('keeps the query', () => {
    expect(validateContentUrlParams({ q: 'foo' })).toEqual({ q: 'foo' });
  });

  it('drops a query that is no string', () => {
    expect(validateContentUrlParams({ q: ['a', 'b'] })).toEqual({ q: undefined });
  });
});
