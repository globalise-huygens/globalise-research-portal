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

  it('uses quote context to disambiguate repeated text', () => {
    const annotation = annotationWithSelectors(
      7,
      18,
      'Pieter Both',
      { prefix: ' / ' },
    );

    expect(findTextSelectorRange(
      annotation,
      targetId,
      'Pieter Both / Pieter Both',
    )).toEqual({ start: 14, end: 25 });
  });

  it('keeps the supplied position when repeated text is equally near', () => {
    const annotation = annotationWithSelectors(7, 18, 'Pieter Both');

    expect(findTextSelectorRange(
      annotation,
      targetId,
      'Pieter Both / Pieter Both',
    )).toEqual({ type: 'TextPositionSelector', start: 7, end: 18 });
  });

  it('does not jump to a matching quote elsewhere in the transcription', () => {
    const annotation = annotationWithSelectors(0, 11, 'Pieter Both');
    const text = `${' '.repeat(65)}Pieter Both`;

    expect(findTextSelectorRange(annotation, targetId, text))
      .toEqual({ type: 'TextPositionSelector', start: 0, end: 11 });
  });
});

function annotationWithSelectors(
  start: number,
  end: number,
  exact: string,
  context: { prefix?: string; suffix?: string } = {},
): Annotation {
  return {
    id: 'entity',
    type: 'Annotation',
    body: [],
    target: [{
      type: 'SpecificResource',
      source: { id: targetId, type: 'Annotation' },
      selector: [
        { type: 'TextQuoteSelector', exact, ...context },
        { type: 'TextPositionSelector', start, end },
      ],
    }],
  };
}
