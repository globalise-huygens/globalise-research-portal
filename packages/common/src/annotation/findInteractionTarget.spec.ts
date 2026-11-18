import { describe, expect, it } from 'vitest';
import type { Annotation, Body } from './AnnoModel';
import { findClassifiedTarget } from './findClassifiedTarget.ts';

describe('findInteractionTarget', () => {
  const word: Annotation = { ...createAnnotation('word', {}), textGranularity: 'word' };
  const entity = createAnnotation('entity', {
    type: 'AppellativeStatus',
    classified_as: { id: 'ner:per_name' },
  });
  const event = createAnnotation('event', {
    classified_as: { id: 'https://github.com/globalise-huygens/nlp-event-detection/wiki#Giving' },
  });

  it('picks the classified annotation with the shortest span', () => {
    const classifiedToWords = { entity: ['foo', 'bar'], event: ['foo'] };
    expect(findClassifiedTarget([word, entity, event], classifiedToWords)).toBe(event);
  });

  it('picks the entity over the event when their spans are equally long', () => {
    const classifiedToWords = { entity: ['foo'], event: ['foo'] };
    expect(findClassifiedTarget([word, event, entity], classifiedToWords)).toBe(entity);
  });

  it('picks the word when there is no classified annotation', () => {
    expect(findClassifiedTarget([word], {})).toBe(word);
  });
});

function createAnnotation(id: string, body: object): Annotation {
  return { id, type: 'Annotation', body: [body as Body], target: [] };
}
