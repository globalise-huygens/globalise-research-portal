import { describe, expect, it } from 'vitest';
import {
  findActiveCanvasSearchHits,
  findActiveSearchHits,
  groupByCanvas,
} from './SearchHitSlice';

const singleHit =
  { id: '0-0', canvasId: 'a', start: 0, end: 1, esHitIndex: 0 };
const splitHitOnCanvas1 =
  { id: '1-0', canvasId: 'a', start: 2, end: 3, esHitIndex: 1 };
const splitHitOnCanvas2 =
  { id: '1-1', canvasId: 'b', start: 0, end: 1, esHitIndex: 1 };

describe(groupByCanvas.name, () => {
  it('groups hits by canvas', () => {
    const hits = [singleHit, splitHitOnCanvas1, splitHitOnCanvas2];
    expect(groupByCanvas(hits)).toEqual({
      'a': [singleHit, splitHitOnCanvas1],
      'b': [splitHitOnCanvas2],
    });
  });
});

describe(findActiveSearchHits.name, () => {
  it('finds all parts of the active es hit across canvases', () => {
    const searchHits = groupByCanvas([singleHit, splitHitOnCanvas1, splitHitOnCanvas2]);
    const slice = { searchHits, activeEsHitIndex: 1 };
    expect(findActiveSearchHits(slice)).toEqual([splitHitOnCanvas1, splitHitOnCanvas2]);
  });

  it('finds no hits without an active es hit', () => {
    const searchHits = groupByCanvas([singleHit]);
    const slice = { searchHits, activeEsHitIndex: null };
    expect(findActiveSearchHits(slice)).toEqual([]);
  });
});

describe(findActiveCanvasSearchHits.name, () => {
  it('finds only the part of the active es hit on the canvas', () => {
    const searchHits = groupByCanvas([singleHit, splitHitOnCanvas1, splitHitOnCanvas2]);
    const activeEsHitIndex = 1;
    const slice = { searchHits, activeEsHitIndex };
    expect(findActiveCanvasSearchHits(slice, 'b')).toEqual([splitHitOnCanvas2]);
  });
});
