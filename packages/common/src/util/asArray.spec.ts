import { describe, expect, it } from 'vitest';
import { asArray } from './asArray';

describe(asArray.name, () => {
  it('wraps a single value', () => {
    expect(asArray('foo')).toEqual(['foo']);
  });

  it('keeps a list', () => {
    expect(asArray(['foo', 'bar'])).toEqual(['foo', 'bar']);
  });

  it('keeps falsy values like zero', () => {
    expect(asArray(0)).toEqual([0]);
  });

  it('finds nothing in undefined and null', () => {
    expect(asArray(undefined)).toEqual([]);
    expect(asArray(null)).toEqual([]);
  });
});
