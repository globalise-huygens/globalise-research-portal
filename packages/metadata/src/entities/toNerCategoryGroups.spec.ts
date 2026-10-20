import { describe, expect, it } from 'vitest';
import type { Annotation } from '@globalise/common/annotation';
import { countMentions, hasSubcategories, toNerCategoryGroups } from './toNerCategoryGroups.ts';

describe(toNerCategoryGroups.name, () => {
  const canvases = [
    { canvasId: 'canvas-1', annotations: [entity('a1', 'ner:per_name'), entity('a2', 'ner:prf'), word('w1')] },
    { canvasId: 'canvas-2', annotations: [entity('a3', 'ner:per_name'), entity('a4', 'ner:date')] },
  ];
  const [persons, dates] = toNerCategoryGroups(canvases);

  it('groups NER categories like the entity highlight menu', () => {
    expect(persons.label).toBe('Persons');
    expect(persons.nerCategories.map((nerCategory) => nerCategory.label)).toEqual(['by Name', 'by Profession']);
  });

  it('collects mentions of a NER category across canvases', () => {
    expect(persons.nerCategories[0].mentions).toEqual([
      { annotationId: 'a1', canvasId: 'canvas-1' },
      { annotationId: 'a3', canvasId: 'canvas-2' },
    ]);
  });

  it('counts the mentions of all NER categories in a group', () => {
    expect(countMentions(persons)).toBe(3);
  });

  it('makes an ungrouped NER category its own group without subcategories', () => {
    expect(dates.label).toBe('Dates');
    expect(hasSubcategories(dates)).toBe(false);
  });

  it('ignores annotations that are not entities', () => {
    expect(toNerCategoryGroups([{ canvasId: 'canvas-1', annotations: [word('w1')] }])).toEqual([]);
  });
});

function entity(id: string, classificationId: string): Annotation {
  return {
    id,
    type: 'Annotation',
    body: { type: 'AppellativeStatus', classified_as: { id: classificationId, type: 'Type', _label: '' } },
    target: [],
  } as unknown as Annotation;
}

function word(id: string): Annotation {
  return { id, type: 'Annotation', body: [], target: [] } as unknown as Annotation;
}
