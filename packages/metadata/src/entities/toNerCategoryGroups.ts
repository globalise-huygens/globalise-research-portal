import {
  entityClassificationGroups,
  getEntityClassificationDefinition,
  isCidocEntityClassificationId,
  type CidocEntityClassificationId,
} from '@globalise/common/annotation';
import type { LinkedArtNode } from '@globalise/common';
import type { NerCategoryGroup } from './EntityPanelModel.ts';

export type NerCategoryTotals = Map<CidocEntityClassificationId, number>;

/**
 * NER categories grouped like the entity highlight menu
 */
export function toNerCategoryGroups(totals?: NerCategoryTotals): NerCategoryGroup[] {
  return entityClassificationGroups
    .map(({ classificationIds, ...group }) => ({
      ...group,
      nerCategories: classificationIds
        .map((id) => ({
          id,
          label: getEntityClassificationDefinition(id).highlightLabel,
          total: totals?.get(id),
        }))
        .filter((nerCategory) => !totals || nerCategory.total),
    }))
    .filter((group) => group.nerCategories.length);
}

/**
 * The annotations set of a document has an annotation collection per NER category,
 * identified by a `.annotations.<tag>` suffix and counted by its `total`.
 */
export function toNerCategoryTotals(collections: LinkedArtNode[]): NerCategoryTotals {
  const totals: NerCategoryTotals = new Map();
  for (const collection of collections) {
    const id = `ner:${collection.id?.split('.annotations.')[1]}`;
    if (isCidocEntityClassificationId(id) && typeof collection.total === 'number') {
      totals.set(id, collection.total);
    }
  }
  return totals;
}

export function countTotal(group: NerCategoryGroup): number | undefined {
  const totals = group.nerCategories.map((nerCategory) => nerCategory.total);
  return totals.every((total) => total !== undefined)
    ? totals.reduce((sum, total) => sum + total, 0)
    : undefined;
}

export function hasSubcategories(group: NerCategoryGroup): boolean {
  return !isCidocEntityClassificationId(group.id);
}
