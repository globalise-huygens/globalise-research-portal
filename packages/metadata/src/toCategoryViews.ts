import {
  MetadataConfig,
  MetadataNode,
  CategoryView,
  MetadataWithComponent, CategoryName,
  defaultCategory, defaultTarget,
} from './MetadataModel';

import { matchRule } from './matchRule.ts';
import { toMetadataWithComponent } from './toMetadataWithComponent.ts';

export function toCategoryViews(
  entries: MetadataNode[],
  config: MetadataConfig,
): CategoryView[] {
  const byCategory = new Map<CategoryName, MetadataWithComponent[]>();

  for (const entry of entries) {
    const target = matchRule(entry, config.rules);
    if (!target && config.onNoMatch === 'hide') {continue;}

    const { category } = target ?? defaultTarget;
    const list = byCategory.get(category) ?? [];
    list.push(toMetadataWithComponent(entry, config.rules));
    byCategory.set(category, list);
  }

  const isAppending = config.onNoMatch === 'append';
  const hasOtherCategory = config.categories.some((c) => c.name === 'other');
  const categories = isAppending && !hasOtherCategory
    ? [...config.categories, defaultCategory]
    : config.categories;

  return categories
    .map((c) => ({ category: c.label, metadata: byCategory.get(c.name) ?? [] }))
    .filter((c) => c.metadata.length);
}