import { describe, expect, it } from 'vitest';
import { toLinkedEntities } from './toLinkedEntities.ts';

describe(toLinkedEntities.name, () => {
  const fooMention = {
    id: 'annotation:foo',
    type: 'Annotation',
    partOf: { id: 'canvas:foo', type: 'Canvas' },
  };
  const barMention = {
    id: 'annotation:bar',
    type: 'Annotation',
    partOf: { id: 'canvas:bar', type: 'Canvas' },
  };
  const place = {
    id: 'place:foo',
    type: 'Place',
    _label: 'Foo',
    subject_of: [{ type: 'AnnotationPage', items: [fooMention, barMention] }],
  };
  const record = {
    type: 'PhysicalHumanMadeThing',
    carries: {
      type: 'LinguisticObject',
      refers_to: [{ type: 'Set', member: [place] }],
    },
  };
  const recordWithoutEntities = {
    type: 'PhysicalHumanMadeThing',
    carries: { type: 'LinguisticObject' },
  };

  it('finds linked entities with their mentions in the document record', () => {
    expect(toLinkedEntities(record)).toEqual([{
      id: 'place:foo',
      type: 'place',
      label: 'Foo',
      mentions: [
        { annotationId: 'annotation:foo', canvasId: 'canvas:foo' },
        { annotationId: 'annotation:bar', canvasId: 'canvas:bar' },
      ],
    }]);
  });

  it('finds no linked entities when the document record refers to none', () => {
    expect(toLinkedEntities(recordWithoutEntities)).toEqual([]);
  });
});
