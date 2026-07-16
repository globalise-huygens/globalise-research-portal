import { describe, expect, it } from 'vitest';
import { Annotation } from './AnnoModel';
import { findTextSelectorRange } from './findTextPositionSelector';

const targetId = 'page-htr';

describe('findTextSelectorRange', () => {
  it('keeps a position range that matches the exact quote', () => {
    const annotation = annotationWithSelectors(1, 12, 'Pieter Both');

    expect(findTextSelectorRange(annotation, targetId, ' Pieter Both '))
      .toEqual({ type: 'TextPositionSelector', start: 1, end: 12 });
  });

  it('corrects a shifted position range using the nearest exact quote', () => {
    const annotation = annotationWithSelectors(0, 11, 'Pieter Both');

    expect(findTextSelectorRange(annotation, targetId, ' Pieter Both '))
      .toEqual({ start: 1, end: 12 });
  });

  it('uses the occurrence nearest to the supplied position', () => {
    const annotation = annotationWithSelectors(13, 23, 'Pieter Both');

    expect(findTextSelectorRange(
      annotation,
      targetId,
      'Pieter Both / Pieter Both',
    )).toEqual({ start: 14, end: 25 });
  });
});

function annotationWithSelectors(
  start: number,
  end: number,
  exact: string,
): Annotation {
  return {
    id: 'entity',
    type: 'Annotation',
    body: [],
    target: [{
      type: 'SpecificResource',
      source: { id: targetId, type: 'Annotation' },
      selector: [
        { type: 'TextQuoteSelector', exact },
        { type: 'TextPositionSelector', start, end },
      ],
    }],
  };
}
