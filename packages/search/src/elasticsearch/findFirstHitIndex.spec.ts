import { describe, expect, it } from 'vitest';
import { findFirstHitIndex } from './findFirstHitIndex';

const hits = [
  { id: '0-0', canvasId: 'a', start: 0, end: 1, esHitIndex: 0 },
  { id: '2-0', canvasId: 'a', start: 2, end: 3, esHitIndex: 2 },
  { id: '2-1', canvasId: 'b', start: 0, end: 1, esHitIndex: 2 },
];

describe(findFirstHitIndex.name, () => {
  it('finds the first part of the es hit', () => {
    expect(findFirstHitIndex(hits, 2)).toBe(1);
  });

  it('returns null when the es hit has no parts', () => {
    expect(findFirstHitIndex(hits, 1)).toBeNull();
  });

  it('returns null without an es hit', () => {
    expect(findFirstHitIndex(hits, null)).toBeNull();
  });
});
