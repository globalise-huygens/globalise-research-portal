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
  const toDocumentMetadata = (...member: object[]) => ({
    type: 'PhysicalHumanMadeThing',
    carries: {
      type: 'LinguisticObject',
      refers_to: [{ type: 'Set', member }],
    },
  });
  const metadataWithoutEntities = {
    type: 'PhysicalHumanMadeThing',
    carries: { type: 'LinguisticObject' },
  };

  it('finds linked entities with their mentions in the metadata', () => {
    expect(toLinkedEntities(toDocumentMetadata(place))).toEqual([{
      id: 'place:foo',
      type: 'place',
      label: 'Foo',
      mentions: [
        { annotationId: 'annotation:foo', canvasId: 'canvas:foo' },
        { annotationId: 'annotation:bar', canvasId: 'canvas:bar' },
      ],
    }]);
  });

  it('sorts linked entities by their number of mentions', () => {
    const rarePlace = {
      ...place,
      id: 'place:bar',
      subject_of: [{ type: 'AnnotationPage', items: [fooMention] }],
    };
    const entities = toLinkedEntities(toDocumentMetadata(rarePlace, place));
    const ids = entities.map((entity) => entity.id);
    expect(ids).toEqual(['place:foo', 'place:bar']);
  });

  it('finds no linked entities when the metadata refers to none', () => {
    expect(toLinkedEntities(metadataWithoutEntities)).toEqual([]);
  });
});
