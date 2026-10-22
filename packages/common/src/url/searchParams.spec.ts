import { describe, expect, it } from 'vitest';
import { parseSearch, stringifySearch } from './searchParams.ts';

describe('searchParams', () => {
  describe(parseSearch.name, () => {
    it('parses q', () => {
      expect(parseSearch('?q=paard')).toEqual({ q: 'paard' });
    });

    it('creates array from repeated values', () => {
      expect(parseSearch('?type=a&type=b')).toEqual({ type: ['a', 'b'] });
    });
  });

  describe(stringifySearch.name, () => {
    it('writes array as repeated keys', () => {
      expect(stringifySearch({ q: '123', type: ['a', 'b'] })).toBe('?q=123&type=a&type=b');
    });

    it('skips empty values', () => {
      expect(stringifySearch({ q: undefined, type: [] })).toBe('');
    });
  });
});

