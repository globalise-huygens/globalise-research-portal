import {
  MetadataConfig,
  MetadataEntry,
  CategoryView,
  MetadataWithComponent, CategoryName, defaultTarget,
} from './MetadataModel';

import { matchToRule } from './matchToRule.ts';
import { linkComponent } from './linkComponent.ts';

export function toCategoryViews(
  entries: MetadataEntry[],
  config: MetadataConfig,
): CategoryView[] {
  const byCategory = new Map<CategoryName, MetadataWithComponent[]>();
  
  const { onNoMatch, categories, defaultCategory } = config;

  if(onNoMatch === 'append' && !categories.some((c) => c.name === defaultCategory)) {
    throw new Error(`Appending but default category ${defaultCategory} not found`);
  }
  
  for (const entry of entries) {
    const target = matchToRule(entry, config.rules);
    if (!target && onNoMatch === 'hide') {
      continue;
    }

    const { category } = target ?? defaultTarget;
    const list = byCategory.get(category) ?? [];
    list.push(linkComponent(entry, config.rules));
    byCategory.set(category, list);
  }

  return categories
    .map((c) => ({ category: c.label, metadata: byCategory.get(c.name) ?? [] }))
    .filter((c) => c.metadata.length);
}