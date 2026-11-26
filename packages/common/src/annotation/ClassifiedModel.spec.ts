import { describe, expect, it } from 'vitest';
import type { Annotation, Body } from './AnnoModel';
import {
  type ClassifiedBody,
  type ClassifiedCategory,
  eventCategory,
  getClassifiedTone,
  isHighlighted,
} from './ClassifiedModel';

const event = createAnnotation<ClassifiedBody>({
  classified_as: { id: 'https://github.com/globalise-huygens/nlp-event-detection/wiki#Giving' },
});

const person = createAnnotation<ClassifiedBody>({
  type: 'AppellativeStatus',
  classified_as: { id: 'ner:per_name' },
});

describe('isHighlighted', () => {
  const word = createAnnotation({ type: 'TextualBody', value: 'gecoren' });

  it('highlights events and entities by their category alike', () => {
    const categories = new Set<ClassifiedCategory>([eventCategory, 'ner:per_name']);
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

describe('getClassifiedTone', () => {
  it('tones events as event', () => {
    expect(getClassifiedTone(event)).toBe('event');
  });

  it('tones entities by their presentation family', () => {
    expect(getClassifiedTone(person)).toBe('person');
  });

  it('has no tone for entities with an unknown classification', () => {
    const entity = createAnnotation<ClassifiedBody>({
      type: 'AppellativeStatus',
      classified_as: { id: 'foo' },
    });
    expect(getClassifiedTone(entity)).toBeUndefined();
  });
});

function createAnnotation<B extends Body = Body>(body: object): Annotation<B> {
  return { id: 'annotation', type: 'Annotation', body: [body as B], target: [] };
}
