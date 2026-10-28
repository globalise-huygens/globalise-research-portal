import { describe, expect, it } from 'vitest';
import type { Annotation, Body } from './AnnoModel';
import { eventCategory, isHighlighted } from './ClassifiedModel';

describe('isHighlighted', () => {
  const event = createAnnotation({
    classified_as: { id: 'https://github.com/globalise-huygens/nlp-event-detection/wiki#Giving' },
  });

  const person = createAnnotation({
    type: 'AppellativeStatus',
    classified_as: { id: 'ner:per_name' },
  });

  const word = createAnnotation({ type: 'TextualBody', value: 'gecoren' });

  it('highlights events and entities by their category alike', () => {
    const categories = new Set([eventCategory, 'ner:per_name' as const]);
    expect(isHighlighted(event, categories)).toBe(true);
    expect(isHighlighted(person, categories)).toBe(true);
  });

  it('hides events and entities whose category is not selected', () => {
    expect(isHighlighted(event, new Set())).toBe(false);
    expect(isHighlighted(person, new Set())).toBe(false);
  });

  it('never highlights annotations that are not classified', () => {
    expect(isHighlighted(word, new Set([eventCategory]))).toBe(false);
  });
});

function createAnnotation(body: object): Annotation {
  return { id: 'annotation', type: 'Annotation', body: [body as Body], target: [] };
}
