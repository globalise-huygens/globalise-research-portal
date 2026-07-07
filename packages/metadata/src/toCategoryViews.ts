import {
  MetadataConfig,
  MetadataNode,
  CategoryView,
  MetadataWithComponent, CategoryName,
  defaultCategory, defaultTarget,
} from './MetadataModel';

import { matchToRule } from './matchToRule.ts';
import { linkComponent } from './linkComponent.ts';

export function toCategoryViews(
  entries: MetadataNode[],
  config: MetadataConfig,
): CategoryView[] {
  const byCategory = new Map<CategoryName, MetadataWithComponent[]>();

  for (const entry of entries) {
    const target = matchToRule(entry, config.rules);
    if (!target && config.onNoMatch === 'hide') {
      continue;
    }

    const { category } = target ?? defaultTarget;
    const list = byCategory.get(category) ?? [];
    list.push(linkComponent(entry, config.rules));
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