import { describe, expect, it } from 'vitest';
import { findActiveEsHitIndex } from './findActiveEsHitIndex';

const esHits = [
  { start: 27, end: 34 },
  { start: 40, end: 46 },
  { start: 50, end: 56 },
];

describe(findActiveEsHitIndex.name, () => {
  it('finds the first es hit that starts within the snippet', () => {
    expect(findActiveEsHitIndex(esHits, { start: 36, end: 60 })).toBe(1);
  });

  it('returns null without a snippet', () => {
    expect(findActiveEsHitIndex(esHits, null)).toBeNull();
  });

  it('returns null when no es hit starts within the snippet', () => {
    expect(findActiveEsHitIndex(esHits, { start: 0, end: 27 })).toBeNull();
  });
});
