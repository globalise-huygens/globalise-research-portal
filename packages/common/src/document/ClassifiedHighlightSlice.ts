import { useMemo } from 'react';
import {
  type Annotation,
  type CidocEntityClassificationId,
  type ClassifiedCategory,
  type Id,
  getCidocEntityClassificationId,
  isClassified,
  isEntity,
  isEvent,
  isHighlighted,
} from '../annotation';
import { setState, useDocumentStore } from './DocumentStore';
import { type CanvasId, useCanvasIndexes } from './ManifestViewerSlice';
import { useAnnotationsWithSearchHits } from './useAnnotationsWithSearchHits';

export type ClassifiedHighlightSlice = {
  highlightCategories: Set<ClassifiedCategory>;
};

export type WordClassifications = {
  entityClassificationId?: CidocEntityClassificationId;
  entityIsHighlighted?: boolean;
  hasEvent?: boolean;
  hasHiddenEvent?: boolean;
};

export function setHighlightCategories(categories: Set<ClassifiedCategory>) {
  setState({ highlightCategories: new Set(categories) });
}

export function toggleHighlightCategory(category: ClassifiedCategory) {
  setState(({ highlightCategories }) => {
    const next = new Set(highlightCategories);
    if (!next.delete(category)) {
      next.add(category);
    }
    return { highlightCategories: next };
  });
}

export function useHighlightCategories() {
  return useDocumentStore((s) => s.highlightCategories);
}

export function useWordClassifications(canvasId: CanvasId) {
  const annotations = useAnnotationsWithSearchHits(canvasId);
  const { classifiedToWords } = useCanvasIndexes(canvasId);
  const categories = useHighlightCategories();
  return useMemo(() => {
    const classifications: Partial<Record<Id, WordClassifications>> = {};
    for (const [classifiedId, wordIds] of Object.entries(classifiedToWords)) {
      const annotation = annotations[classifiedId];
      if (!annotation) {
        continue;
      }
      const highlighted = isHighlighted(annotation, categories);
      for (const wordId of wordIds) {
        const word = classifications[wordId] ??= {};
        if (isEvent(annotation)) {
          if (highlighted) {
            word.hasEvent = true;
          } else {
            word.hasHiddenEvent = true;
          }
        } else if (isEntity(annotation)) {
          if (highlighted || !word.entityIsHighlighted) {
            word.entityClassificationId = getCidocEntityClassificationId(annotation);
          }
          if (highlighted) {
            word.entityIsHighlighted = true;
          } else {
            word.entityIsHighlighted ??= false;
          }
        }
      }
    }
    return classifications;
  }, [annotations, classifiedToWords, categories]);
}

export function useHighlightedAnnotations(
  canvasId: CanvasId,
): Record<Id, Annotation> {
  const annotations = useAnnotationsWithSearchHits(canvasId);
  const categories = useHighlightCategories();
  return useMemo(() => {
    const highlighted: Record<Id, Annotation> = {};
    for (const [id, annotation] of Object.entries(annotations)) {
      if (isClassified(annotation) && !isHighlighted(annotation, categories)) {
        continue;
      }
      highlighted[id] = annotation;
    }
    return highlighted;
  }, [annotations, categories]);
}

export function useIsHighlighted(annotation: Annotation): boolean {
  return useDocumentStore((s) => isHighlighted(annotation, s.highlightCategories));
}
