import { describe, expect, it } from 'vitest';
import { findActiveSearchHits, groupByCanvas } from './SearchHitSlice';

const firstHit = { canvasId: 'canvas-1', start: 0, end: 4, esHitIndex: 0 };
const splitHitStart = { canvasId: 'canvas-1', start: 90, end: 96, esHitIndex: 1 };
const splitHitEnd = { canvasId: 'canvas-2', start: 0, end: 3, esHitIndex: 1 };

describe(groupByCanvas.name, () => {
  it('groups hits by canvas', () => {
    expect(groupByCanvas([firstHit, splitHitStart, splitHitEnd])).toEqual({
      'canvas-1': [firstHit, splitHitStart],
      'canvas-2': [splitHitEnd],
    });
  });
});

describe(findActiveSearchHits.name, () => {
  it('finds all parts of the active es hit across canvases', () => {
    const searchHits = groupByCanvas([firstHit, splitHitStart, splitHitEnd]);
    expect(findActiveSearchHits({ searchHits, activeEsHitIndex: 1 })).toEqual([splitHitStart, splitHitEnd]);
  });

  it('finds no hits without an active es hit', () => {
    const searchHits = groupByCanvas([firstHit]);
    expect(findActiveSearchHits({ searchHits, activeEsHitIndex: null })).toEqual([]);
  });
});
