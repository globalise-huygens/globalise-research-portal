import { useMemo } from 'react';
import { type Annotation, getPageText, type Id } from '../annotation';
import { type CanvasId, useCanvasAnnotations } from './ManifestViewerSlice';
import { useCanvasSearchHits } from './SearchHitSlice';
import { toSearchHitAnnotation } from './toSearchHitAnnotation';

/**
 * Merge annotations from different sources:
 * - annotation pages
 * - search hits
 */
export function useAnnotationsWithSearchHits(canvasId: CanvasId): Record<Id, Annotation> {
  const annotations = useCanvasAnnotations(canvasId);
  const hits = useCanvasSearchHits(canvasId);

  return useMemo(() => {
    if (!hits.length || !Object.keys(annotations).length) {
      return annotations;
    }
    const { id: pageAnnoId } = getPageText(annotations);
    const merged = { ...annotations };
    for (const hit of hits) {
      const annotation = toSearchHitAnnotation(hit, pageAnnoId);
      merged[annotation.id] = annotation;
    }
    return merged;
  }, [annotations, hits]);
}
