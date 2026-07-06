import {
  MetadataCategory,
  MetadataConfig,
  MetadataEntry,
  CategoryView,
  ComponentEntry, CategoryName,
} from './MetadataModel';

import { asArray } from './asArray.ts';

export const defaultCategory = {
  name: 'other' as CategoryName,
  label: 'Other',
} satisfies MetadataCategory;

export function toCategoryViews(
  metadataEntries: MetadataEntry[],
  config: MetadataConfig,
): CategoryView[] {
  const categoryComponentEntries = new Map<CategoryName, ComponentEntry[]>();

  for (const entry of metadataEntries) {
    const rule = config.rules.find((rule) => {
      const { classifiedAs, propName } = entry.source;
      return asArray(rule.sourceMatcher).some((m) => m === classifiedAs || m === propName);
    });
    if (!rule && config.onNoMatch === 'hide') {
      continue;
    }

    const { category = 'other', component = 'default', label } = rule?.target ?? {};
    const item: ComponentEntry = {
      componentName: component,
      entry: label ? { ...entry, label } : entry,
    };
    const componentEntries = categoryComponentEntries.get(category) ?? [];
    componentEntries.push(item);
    categoryComponentEntries.set(category, componentEntries);
  }

  const isAppending = config.onNoMatch === 'append';
  const hasOtherCategory = config.categories.some((c) => c.name === 'other');

  const categories = isAppending && !hasOtherCategory
    ? [...config.categories, defaultCategory]
    : config.categories;

  return categories
    .map((c) => {
      const items = categoryComponentEntries.get(c.name) ?? [];
      const categoryName = c.label;
      return ({ categoryName, items });
    })
    .filter((c) => c.items.length > 0);
}