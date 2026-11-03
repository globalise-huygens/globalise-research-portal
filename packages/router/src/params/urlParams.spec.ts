import { describe, expect, it } from 'vitest';
import { asString, parseUrlParams, stringifyUrlParams } from './urlParams.ts';

describe('urlParams', () => {
  describe(parseUrlParams.name, () => {
    it('parses q', () => {
      const urlParams = parseUrlParams('?q=paard');
      expect(urlParams).toEqual({ q: 'paard' });
    });

    it('creates array from repeated values', () => {
      const urlParams = parseUrlParams('?type=a&type=b');
      expect(urlParams).toEqual({ type: ['a', 'b'] });
    });
  });

  describe(stringifyUrlParams.name, () => {
    it('writes array as repeated keys', () => {
      const query = stringifyUrlParams({ q: '123', type: ['a', 'b'] });
      expect(query).toBe('?q=123&type=a&type=b');
    });

    it('skips empty values', () => {
      const query = stringifyUrlParams({ q: undefined, type: [] });
      expect(query).toBe('');
    });
  });

  describe(asString.name, () => {
    it('keeps strings and stringifies numbers', () => {
      const values = [asString('1053'), asString(1053)];
      expect(values).toEqual(['1053', '1053']);
    });

    it('drops other values', () => {
      const values = [asString(['a']), asString(undefined)];
      expect(values).toEqual([undefined, undefined]);
    });
  });
});
