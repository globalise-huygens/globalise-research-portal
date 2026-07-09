import { Annotation } from './AnnoModel.ts';
import { getPrimaryEntityBody } from './EntityModel.ts';

export function getEntityType(entity: Annotation) {
  const body = getPrimaryEntityBody(entity);
  return body.classified_as._label;
}
