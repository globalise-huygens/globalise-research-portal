import { describe, expect, it } from 'vitest';
import { findWordsByOffsets } from './findWordsByOffsets.ts';

const words = [
  { id: 'Amster-', start: 0, end: 7 },
  { id: 'dam', start: 8, end: 11 },
];

describe(findWordsByOffsets.name, () => {
  it('finds all words partially overlapping the range', () => {
    const offsets = { start: 3, end: 9 };
    expect(findWordsByOffsets(words, offsets)).toEqual(['Amster-', 'dam']);
  });

  it('excludes words only touching the range', () => {
    const offsets = { start: 7, end: 12 };
    expect(findWordsByOffsets(words, offsets)).toEqual(['dam']);
  });
});
