import { describe, expect, it } from 'vitest';
import { findTextPositionSelector, isSearchHit } from '../annotation';
import { toSearchHitAnnotation } from './toSearchHitAnnotation';

const hit = { id: '2-0', canvasId: '1', start: 3, end: 9, esHitIndex: 2 };

describe(toSearchHitAnnotation.name, () => {
  it('creates a search hit annotation', () => {
    expect(isSearchHit(toSearchHitAnnotation(hit, 'page-htr'))).toBe(true);
  });

  it('takes over the hit id', () => {
    expect(toSearchHitAnnotation(hit, 'page-htr').id).toBe('2-0');
  });

  it('targets the hit offsets in the page text', () => {
    const annotation = toSearchHitAnnotation(hit, 'page-htr');
    expect(findTextPositionSelector(annotation, 'page-htr')).toMatchObject({ start: 3, end: 9 });
  });
});
