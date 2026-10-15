import { describe, expect, it } from 'vitest';
import { findActiveEsHitIndex } from './findActiveEsHitIndex';

const esHits = [
  { start: 27, end: 34 },
  { start: 40, end: 46 },
];

describe(findActiveEsHitIndex.name, () => {
  it('finds the es hit that starts where the snippet hit starts', () => {
    expect(findActiveEsHitIndex(esHits, { start: 40, end: 46 })).toBe(1);
  });

  it('returns null without a snippet hit', () => {
    expect(findActiveEsHitIndex(esHits, null)).toBeNull();
  });

  it('returns null when no es hit starts at the snippet hit', () => {
    expect(findActiveEsHitIndex(esHits, { start: 12, end: 16 })).toBeNull();
  });
});
