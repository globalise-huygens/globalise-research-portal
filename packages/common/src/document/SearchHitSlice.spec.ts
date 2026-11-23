import { beforeEach, describe, expect, it } from 'vitest';
import { useDocumentStore } from './DocumentStore';
import {
  findActiveCanvasSearchHits,
  findActiveSearchHit,
  groupByCanvas,
  selectSearchHit,
  setSearchHits,
  toActiveHitIndex,
} from './SearchHitSlice';

const singleHit =
  { id: '0-0', canvasId: 'a', start: 0, end: 1, esHitIndex: 0 };
const splitHitOnCanvas1 =
  { id: '1-0', canvasId: 'a', start: 2, end: 3, esHitIndex: 1 };
const splitHitOnCanvas2 =
  { id: '1-1', canvasId: 'b', start: 0, end: 1, esHitIndex: 1 };
const hits = [singleHit, splitHitOnCanvas1, splitHitOnCanvas2];

describe(groupByCanvas.name, () => {
  it('groups hits by canvas', () => {
    expect(groupByCanvas(hits)).toEqual({
      'a': [singleHit, splitHitOnCanvas1],
      'b': [splitHitOnCanvas2],
    });
  });
});

describe(toActiveHitIndex.name, () => {
  it('activates the located hit', () => {
    expect(toActiveHitIndex(hits, 2)).toBe(2);
  });

  it('activates the first hit when no hit is located', () => {
    expect(toActiveHitIndex(hits, null)).toBe(0);
  });

  it('activates no hit without hits', () => {
    expect(toActiveHitIndex([], null)).toBeNull();
  });
});

describe(findActiveSearchHit.name, () => {
  it('finds the part of a split hit by its index', () => {
    expect(findActiveSearchHit({ hits, activeHitIndex: 2 })).toBe(splitHitOnCanvas2);
  });

  it('finds no hit without an active hit', () => {
    expect(findActiveSearchHit({ hits, activeHitIndex: null })).toBeNull();
  });
});

describe(findActiveCanvasSearchHits.name, () => {
  it('finds the active hit on its canvas', () => {
    expect(findActiveCanvasSearchHits({ hits, activeHitIndex: 1 }, 'a')).toEqual([splitHitOnCanvas1]);
  });

  it('finds no hits on another canvas, also not the other part of a split hit', () => {
    expect(findActiveCanvasSearchHits({ hits, activeHitIndex: 1 }, 'b')).toEqual([]);
  });
});

describe(selectSearchHit.name, () => {
  beforeEach(() => {
    useDocumentStore.setState({ selectedCanvasId: 'a', selectedCanvasSource: 'external', selectedCanvasAt: 0 });
    setSearchHits(hits, 0);
  });

  it('activates the hit', () => {
    selectSearchHit(1);
    expect(useDocumentStore.getState().activeHitIndex).toBe(1);
  });

  it('selects the canvas of a hit on another canvas', () => {
    selectSearchHit(2);
    expect(useDocumentStore.getState().selectedCanvasId).toBe('b');
  });

  it('keeps the canvas selection for a hit on the selected canvas', () => {
    selectSearchHit(1);
    expect(useDocumentStore.getState().selectedCanvasAt).toBe(0);
  });
});
