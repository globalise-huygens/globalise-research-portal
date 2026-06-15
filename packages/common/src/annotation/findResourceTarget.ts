import { Annotation, AnnotationResourceTarget } from './AnnoModel';
import { isAnnotationResourceTarget } from './isAnnotationResourceTarget';
import { asArray } from './asArray.ts';

export function findResourceTarget(
  annotation: Annotation,
): AnnotationResourceTarget | undefined {
  const targets = asArray(annotation.target);
  return targets.find(isAnnotationResourceTarget);
}
