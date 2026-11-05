import { Annotation } from './AnnoModel.ts';
import { type AnnotationPresentationFamily } from '../PresentationFamily.ts';
import {
  CidocEntityClassificationId,
  getCidocClassName,
  getCidocEntityClassificationId,
  getCidocEntityClassifiedAsLabel,
  getEntityPresentationFamilyByClassificationId,
} from './CidocEntityModel.ts';
import { EntityBody, getEntityAnnotationBodyClassName, isEntity } from './EntityModel.ts';
import { EventBody, isEvent } from './EventModel.ts';
import { toClassName } from './toClassName.ts';

export type ClassifiedBody = EntityBody | EventBody;

export type ClassifiedCategory = CidocEntityClassificationId | typeof eventCategory;

export type ClassifiedTone = AnnotationPresentationFamily | typeof eventCategory;

export type ClassifiedType = 'entity' | 'event';

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

export function isHiddenClassified(
  annotation: Annotation,
  categories: Set<ClassifiedCategory>,
): boolean {
  return isClassified(annotation) && !isHighlighted(annotation, categories);
}

export function getClassifiedCategory(
  annotation: Annotation<ClassifiedBody>,
): ClassifiedCategory | undefined {
  return isEvent(annotation) ? eventCategory : getCidocEntityClassificationId(annotation);
}

export function getClassifiedType(annotation: Annotation<ClassifiedBody>): ClassifiedType {
  return isEvent(annotation) ? 'event' : 'entity';
}

export function getClassifiedTone(
  annotation: Annotation<ClassifiedBody>,
): ClassifiedTone | undefined {
  if (isEvent(annotation)) {
    return eventCategory;
  }
  const classificationId = getCidocEntityClassificationId(annotation);
  return classificationId
    ? getEntityPresentationFamilyByClassificationId(classificationId)
    : undefined;
}

export function getClassifiedClassNames(annotation: Annotation<ClassifiedBody>): string[] {
  if (isEvent(annotation)) {
    return ['event'];
  }
  const classNames = [
    'entity',
    getEntityAnnotationBodyClassName(annotation),
    getCidocClassName(annotation),
    toClassName(getCidocEntityClassifiedAsLabel(annotation)),
  ];
  const tone = getClassifiedTone(annotation);
  if (tone) {
    classNames.push(`annotation-${tone}`);
  }
  return classNames;
}
