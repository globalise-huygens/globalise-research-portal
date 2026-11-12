import { describe, expect, it } from 'vitest';
import { parseAnnotationId } from './annotationId';

describe(parseAnnotationId.name, () => {
  // future: https://id.globalise.nl/hdl:20.500.14722
  const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

  const canvasName = 'NL-HaNA_1.04.02_1053_0004';
  const entities = `${handle}/annotations:entities:${canvasName}`;
  const transcriptions = `${handle}/annotations:transcriptions:${canvasName}`;
  const entity = `${entities}#person:000074`;
  const word = `${transcriptions}#word_54b1ed7d-59ec-466b-8f9d-37af98a9273e`;
  const page = { inventory: '1053', page: '0004' };

  it('reads the page and entity of an entity annotation', () => {
    const fragment = 'person:000074';
    expect(parseAnnotationId(entity)).toEqual({ ...page, fragment });
  });

  it('reads the page and word of a word annotation', () => {
    const fragment = 'word_54b1ed7d-59ec-466b-8f9d-37af98a9273e';
    expect(parseAnnotationId(word)).toEqual({ ...page, fragment });
  });

  it('ignores an annotation page', () => {
    expect(parseAnnotationId(entities)).toBeUndefined();
  });
});
