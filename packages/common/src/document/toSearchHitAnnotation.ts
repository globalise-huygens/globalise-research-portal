import type { Annotation, Id, SearchHitBody } from '../annotation';
import type { HtrHit } from './SearchHitSlice';

export function toSearchHitAnnotation(
  hit: HtrHit,
  pageAnnoId: Id,
): Annotation<SearchHitBody> {
  const { id, start, end, esHitIndex } = hit;
  return {
    id,
    type: 'Annotation',
    motivation: 'highlighting',
    body: { type: 'SearchHit', esHitIndex },
    target: [{
      type: 'SpecificResource',
      source: { id: pageAnnoId, type: 'Annotation' },
      selector: { type: 'TextPositionSelector', start, end },
    }],
  };
}
