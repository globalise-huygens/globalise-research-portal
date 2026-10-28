import { describe, expect, it } from 'vitest';
import type { Annotation, Body } from './AnnoModel';
import { indexAnnotations } from './indexAnnotations';

const pageId = 'page-normalized';

function createAnnotation(
  id: string,
  [start, end]: [number, number],
  fields: Partial<Annotation> = {},
): Annotation {
  return {
    id,
    type: 'Annotation',
    body: [],
    target: [{
      type: 'SpecificResource',
      source: { id: pageId, type: 'Annotation' },
      selector: { type: 'TextPositionSelector', start, end },
    }],
    ...fields,
  } as Annotation;
}

const eventBody = {
  classified_as: { id: 'https://github.com/globalise-huygens/nlp-event-detection/wiki#Giving' },
} as Body;

const entityBody = {
  type: 'AppellativeStatus',
  classified_as: { id: 'ner:per_name' },
} as Body;

const annotations = Object.fromEntries([
  createAnnotation('word:1', [0, 5], { textGranularity: 'word' }),
  createAnnotation('word:2', [6, 11], { textGranularity: 'word' }),
  createAnnotation('event', [0, 5], { body: [eventBody] }),
  createAnnotation('entity', [0, 11], { body: [entityBody] }),
].map((annotation) => [annotation.id, annotation]));

describe('indexAnnotations', () => {
  it('maps entities and events alike to the words they overlap', () => {
    expect(indexAnnotations(annotations, pageId).classifiedToWords).toEqual({
      event: ['word:1'],
      entity: ['word:1', 'word:2'],
    });
  });
});
