import { useMemo } from 'react';
import {
  type Annotation,
  type CidocEntityClassificationId,
  type Id,
  isEntity,
  isHighlightedEntity,
  getCidocEntityClassificationId,
} from '../annotation';
import { setState, useDocumentStore } from './DocumentStore';
import { type CanvasId, useAnnotations, useCanvasIndexes } from './ManifestViewerSlice';

export type EntityHighlightSlice = {
  entityHighlightCategories: Set<CidocEntityClassificationId>;
};

export function setEntityHighlightCategories(
  categories: Set<CidocEntityClassificationId>,
) {
  setState({ entityHighlightCategories: new Set(categories) });
}

export function useEntityHighlightCategories() {
  return useDocumentStore((s) => s.entityHighlightCategories);
}

export function useWordEntityClassifications(canvasId: CanvasId) {
  const annotations = useAnnotations(canvasId);
  const { entityToWords } = useCanvasIndexes(canvasId);
  const categories = useEntityHighlightCategories();
  return useMemo(() => {
    const classifications: Partial<Record<Id, CidocEntityClassificationId>> = {};
    for (const [entityId, wordIds] of Object.entries(entityToWords)) {
      const annotation = annotations[entityId];
      if (!annotation || !isHighlightedEntity(annotation, categories)) {
        continue;
      }
      const classificationId = getCidocEntityClassificationId(annotation);
      for (const wordId of wordIds) {
        classifications[wordId] ??= classificationId;
      }
    }
    return classifications;
  }, [annotations, entityToWords, categories]);
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
