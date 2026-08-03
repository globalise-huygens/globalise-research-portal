import { useMemo } from 'react';
import { Annotation, findPageTextId, Id } from '../annotation';
import { useCanvasAnnotations, type CanvasId } from './ManifestViewerSlice';
import { useSearchResultsForCanvas } from './SearchResultsSlice';
import { toSearchAnnotation } from './toSearchAnnotation';

/**
 * Canvas annotations, merged with the search results of that canvas.
 * Returns unaltered when there is nothing to merge.
 */
export function useAnnotations(canvasId: CanvasId): Record<Id, Annotation> {
  const annotations = useCanvasAnnotations(canvasId);
  const results = useSearchResultsForCanvas(canvasId);

  return useMemo(() => {
    const pageAnnoId = results.length
      ? findPageTextId(annotations)
      : undefined;
    if (!pageAnnoId) {
      return annotations;
    }
    const merged = { ...annotations };
    for (const result of results) {
      const annotation = toSearchAnnotation(result, pageAnnoId);
      merged[annotation.id] = annotation;
    }
    return merged;
  }, [annotations, results]);
}
