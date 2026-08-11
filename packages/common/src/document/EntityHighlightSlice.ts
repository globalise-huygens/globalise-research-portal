import { useMemo } from 'react';
import {
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

export function useIsHighlightedEntity(annotation: Annotation): boolean {
  return useDocumentStore((s) =>
    isHighlightedEntity(annotation, s.entityHighlightCategories),
  );
}
