import { describe, expect, it } from 'vitest';
import type { Annotation, Body } from './AnnoModel';
import { getEventBody, isEvent } from './EventModel';

const eventBody = {
  id: 'events#event:000287',
  type: 'SpeechAct',
  _label: 'verliesen',
  classified_as: {
    id: 'https://github.com/globalise-huygens/nlp-event-detection/wiki#AlteringARelationship',
    type: 'Type',
    _label: 'Altering a relationship',
  },
};

const entityBody = {
  type: 'AppellativeStatus',
  classified_as: { id: 'ner:date', type: 'Type', _label: 'Date' },
};

function createAnnotation(body: object): Annotation {
  return { id: 'annotation:1', type: 'Annotation', body: [body as Body], target: [] };
}

describe('isEvent', () => {
  it('recognizes an event by its classification in the event typology', () => {
    expect(isEvent(createAnnotation(eventBody))).toBe(true);
  });

  it('rejects an entity, although its status type resembles an event type', () => {
    expect(isEvent(createAnnotation(entityBody))).toBe(false);
  });
});

describe(getEventBody.name, () => {
  it('returns the event body, with its own id instead of the annotation id', () => {
    const annotation = createAnnotation(eventBody);
    expect(isEvent(annotation) && getEventBody(annotation).id).toBe('events#event:000287');
  });
});
