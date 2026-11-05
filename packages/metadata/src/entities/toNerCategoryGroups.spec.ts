import { describe, expect, it } from 'vitest';
import {
  countTotal,
  hasSubcategories,
  toNerCategoryGroups,
  type NerCategoryTotals,
} from './toNerCategoryGroups.ts';

describe(toNerCategoryGroups.name, () => {
  const totals: NerCategoryTotals = new Map([
    ['ner:per_name', 1],
    ['ner:prf', 2],
    ['ner:date', 1],
  ]);
  const [persons, dates] = toNerCategoryGroups(totals);
  const [firstGroupWithoutTotals] = toNerCategoryGroups();

  it('groups NER categories like the entity highlight menu', () => {
    expect(persons.label).toBe('Persons');
    const labels = persons.nerCategories.map(({ label }) => label);
    expect(labels).toEqual(['by Name', 'by Profession']);
  });

  it('counts the totals of all NER categories in a group', () => {
    expect(countTotal(persons)).toBe(3);
  });

  it('makes an ungrouped NER category a group without subcategories', () => {
    expect(dates.label).toBe('Dates');
    expect(hasSubcategories(dates)).toBe(false);
  });

  it('lists NER categories without counts when totals are unavailable', () => {
    const categoryTotals = firstGroupWithoutTotals.nerCategories
      .map(({ total }) => total);
    expect(categoryTotals.every((total) => total === undefined)).toBe(true);
    expect(countTotal(firstGroupWithoutTotals)).toBeUndefined();
  });
});
