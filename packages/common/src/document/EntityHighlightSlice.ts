import { useShallow } from 'zustand/react/shallow';
import {
  entityVisualCategories,
  type EntityVisualCategoryClassName,
  getEntityClassifiedAsClassName,
  isEntity,
} from '../annotation';
import { setState, useDocumentStore } from './DocumentStore';

export type EntityHighlightSlice = {
  entityHighlightCategories: Set<EntityVisualCategoryClassName>;
};

export const defaultEntityHighlightSlice: EntityHighlightSlice = {
  entityHighlightCategories: new Set(entityVisualCategories),
};

export function setEntityHighlightCategories(
  categories: Set<EntityVisualCategoryClassName>,
) {
  setState({ entityHighlightCategories: new Set(categories) });
}

export function useEntityHighlightCategories() {
  return useDocumentStore((s) => s.entityHighlightCategories);
}

export function useIsEntityHighlightCategoryVisible(
  category: EntityVisualCategoryClassName,
) {
  return useDocumentStore((s) => s.entityHighlightCategories.has(category));
}

export function useEntityHighlightCounts() {
  return useDocumentStore(useShallow((s) => {
    const counts = Object.fromEntries(
      entityVisualCategories.map((category) => [category, 0]),
    ) as Record<EntityVisualCategoryClassName, number>;

    for (const canvas of Object.values(s.canvases)) {
      for (const annotation of Object.values(canvas.annotations ?? {})) {
        if (isEntity(annotation)) {
          counts[getEntityClassifiedAsClassName(annotation)] += 1;
        }
      }
    }

    return counts;
  }));
}
