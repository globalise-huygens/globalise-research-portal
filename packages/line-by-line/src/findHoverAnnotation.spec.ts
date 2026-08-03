import type { Annotation } from '@globalise/common/annotation';
import { describe, expect, it } from 'vitest';
import { findHoverAnnotation } from './findHoverAnnotation';

describe('findHoverAnnotation', () => {
  it('returns the annotation, not its classification ID', () => {
    const entityAnnotation = {
      id: 'annotation-123',
      type: 'Annotation',
      body: {
        type: 'AppellativeStatus',
        classified_as: {
          id: 'gan:PER_NAME',
          type: 'Type',
          _label: 'Person name',
        },
        ascribes_classification: {
          id: 'classification-assignment-123',
          type: 'TypeAssignment',
          _label: 'Person name classification',
        },
      },
      target: [],
    } as Annotation;

    const annotation = findHoverAnnotation(
      [entityAnnotation],
      new Set(['gan:PER_NAME']),
    );

    expect(annotation).toBe(entityAnnotation);
    expect(annotation?.id).toBe('annotation-123');
    expect(annotation?.id).not.toBe('gan:PER_NAME');
  });
});
