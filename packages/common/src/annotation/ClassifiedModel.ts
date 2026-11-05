import { Annotation } from './AnnoModel.ts';
import {
  CidocEntityClassificationId,
  getCidocClassName,
  getCidocEntityClassificationId,
  getCidocEntityClassifiedAsLabel,
} from './CidocEntityModel.ts';
import { EntityBody, getEntityAnnotationBodyClassName, isEntity } from './EntityModel.ts';
import { EventBody, isEvent } from './EventModel.ts';
import { toClassName } from './toClassName.ts';

export type ClassifiedBody = EntityBody | EventBody;

export type ClassifiedCategory = CidocEntityClassificationId | typeof eventCategory;

export const eventCategory = 'event';

export const isClassified = (
  annotation: Annotation,
): annotation is Annotation<ClassifiedBody> => isEntity(annotation) || isEvent(annotation);

export function isHighlighted(
  annotation: Annotation,
  categories: Set<ClassifiedCategory>,
): boolean {
  if (!isClassified(annotation)) {
    return false;
  }
  const category = getClassifiedCategory(annotation);
  return !!category && categories.has(category);
}

export function getClassifiedCategory(
  annotation: Annotation<ClassifiedBody>,
): ClassifiedCategory | undefined {
  return isEvent(annotation) ? eventCategory : getCidocEntityClassificationId(annotation);
}

export function getClassifiedClassNames(annotation: Annotation<ClassifiedBody>): string[] {
  if (isEvent(annotation)) {
    return ['event'];
  }
  return [
    'entity',
    getEntityAnnotationBodyClassName(annotation),
    getCidocClassName(annotation),
    toClassName(getCidocEntityClassifiedAsLabel(annotation)),
  ];
}
