import {
  getCidocEntityClassificationId,
  getEntityClassificationDefinition,
  isEntity,
  type Annotation,
} from '@globalise/common/annotation';
import type { CanvasId } from '@globalise/common/document';
import type { NerCategory, NerCategoryGroup } from './EntityPanelModel.ts';

export type CanvasAnnotations = {
  canvasId: CanvasId;
  annotations: Annotation[];
};

/**
 * NER category groups bundle the entity mentions of the given canvases
 * by their NER category, grouped like the entity highlight menu.
 */
export function toNerCategoryGroups(canvases: CanvasAnnotations[]): NerCategoryGroup[] {
  const groups = new Map<string, NerCategoryGroup>();
  const nerCategories = new Map<string, NerCategory>();

  for (const { canvasId, annotations } of canvases) {
    for (const annotation of annotations.filter(isEntity)) {
      const id = getCidocEntityClassificationId(annotation);
      if (!id) {
        continue;
      }
      let nerCategory = nerCategories.get(id);
      if (!nerCategory) {
        const definition = getEntityClassificationDefinition(id);
        const groupInfo = definition.highlightGroup ?? { id, label: definition.highlightLabel };
        nerCategory = { id, label: definition.highlightLabel, mentions: [] };
        nerCategories.set(id, nerCategory);
        const group = groups.get(groupInfo.id) ?? { ...groupInfo, nerCategories: [] };
        group.nerCategories.push(nerCategory);
        groups.set(group.id, group);
      }
      nerCategory.mentions.push({ annotationId: annotation.id, canvasId });
    }
  }
  return [...groups.values()];
}

export function countMentions(group: NerCategoryGroup): number {
  return group.nerCategories.reduce((sum, nerCategory) => sum + nerCategory.mentions.length, 0);
}

export function hasSubcategories(group: NerCategoryGroup): boolean {
  return group.nerCategories.some((nerCategory) => nerCategory.id !== group.id);
}
