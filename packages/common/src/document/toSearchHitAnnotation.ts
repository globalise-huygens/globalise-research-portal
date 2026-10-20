import { type Annotation, type Id, type SearchHitBody, searchHitBody } from '../annotation';
import type { HtrHit } from './SearchHitSlice';

export function toSearchHitAnnotation(
  hit: HtrHit,
  pageAnnoId: Id,
): Annotation<SearchHitBody> {
  const { id, start, end } = hit;
  return {
    id,
    type: 'Annotation',
    motivation: 'highlighting',
    body: searchHitBody,
    target: [{
      type: 'SpecificResource',
      source: { id: pageAnnoId, type: 'Annotation' },
      selector: { type: 'TextPositionSelector', start, end },
    }],
  };
}
