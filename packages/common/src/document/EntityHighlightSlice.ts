import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  entityVisualCategories,
  type Annotation,
  type EntityClassificationId,
  type Id,
  isEntity,
  isHighlightedEntity,
} from '../annotation';
import { setState, useDocumentStore } from './DocumentStore';
import { type CanvasId, useAnnotations } from './ManifestViewerSlice';

export type EntityHighlightSlice = {
  entityHighlightCategories: Set<EntityClassificationId>;
};

export function setEntityHighlightCategories(
  categories: Set<EntityClassificationId>,
) {
  setState({ entityHighlightCategories: new Set(categories) });
}

export function useEntityHighlightCategories() {
  return useDocumentStore((s) => s.entityHighlightCategories);
}

export function useHighlightedAnnotations(
  canvasId: CanvasId,
): Record<Id, Annotation> {
  const annotations = useAnnotations(canvasId);
  const categories = useEntityHighlightCategories();
  return useMemo(() => {
    const highlighted: Record<Id, Annotation> = {};
    for (const [id, annotation] of Object.entries(annotations)) {
      if (isEntity(annotation) && !isHighlightedEntity(annotation, categories)) {
        continue;
      }
      highlighted[id] = annotation;
    }
    return highlighted;
  }, [annotations, categories]);
}

export function useIsEntityHighlightCategoryVisible(
  classificationId?: EntityClassificationId,
) {
  return useDocumentStore((s) =>
    classificationId !== undefined &&
    s.entityHighlightCategories.has(classificationId),
  );
}
