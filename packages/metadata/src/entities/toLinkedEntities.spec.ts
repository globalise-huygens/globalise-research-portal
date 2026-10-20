import { describe, expect, it } from 'vitest';
import { toLinkedEntities } from './toLinkedEntities.ts';

describe(toLinkedEntities.name, () => {
  it('finds linked entities with their mentions in the document record', () => {
    const record = {
      type: 'PhysicalHumanMadeThing',
      carries: {
        type: 'LinguisticObject',
        refers_to: [{
          type: 'Set',
          member: [{
            id: 'place:GLOB2_894',
            type: 'Place',
            _label: 'Batavia',
            subject_of: [{
              type: ['DigitalObject', 'AnnotationPage'],
              items: [
                { id: 'annotation:201', type: 'Annotation', partOf: { id: 'canvas-1', type: 'Canvas' } },
                { id: 'annotation:253', type: 'Annotation', partOf: { id: 'canvas-2', type: 'Canvas' } },
              ],
            }],
          }],
        }],
      },
    };

    expect(toLinkedEntities(record)).toEqual([{
      id: 'place:GLOB2_894',
      type: 'Place',
      label: 'Batavia',
      mentions: [
        { annotationId: 'annotation:201', canvasId: 'canvas-1' },
        { annotationId: 'annotation:253', canvasId: 'canvas-2' },
      ],
    }]);
  });

  it('finds no linked entities when the document record refers to none', () => {
    expect(toLinkedEntities({ type: 'PhysicalHumanMadeThing', carries: { type: 'LinguisticObject' } })).toEqual([]);
  });
});
