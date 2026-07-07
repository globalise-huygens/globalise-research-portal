import {
  MetadataConfig,
  MetadataEntry,
  CategoryView,
  ComponentEntry, CategoryName,
  defaultCategory, defaultTarget,
} from './MetadataModel';

import { matchRule } from './matchRule.ts';

export function toCategoryViews(
  metadataEntries: MetadataEntry[],
  config: MetadataConfig,
): CategoryView[] {
  const categoryComponentEntries = new Map<CategoryName, ComponentEntry[]>();

  for (const entry of metadataEntries) {
    const target = matchRule(entry, config);

    if (!target && config.onNoMatch === 'hide') {
      continue;
    }

    const { category, component, label } = target ?? defaultTarget;

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
    .filter((c) => c.items.length);
}