import {
  type Annotation,
  type EntityClassificationId,
  getEntityClassificationId,
  isEntity,
  isWord,
} from '@globalise/common/annotation';

export function findHoverAnnotation(
  annotations: Annotation[],
  highlightedEntityClassifications: Set<EntityClassificationId>,
): Annotation | undefined {
  const entityAnnotation = annotations.find((annotation) => {
    if (!isEntity(annotation)) {
      return false;
    }
    const classificationId = getEntityClassificationId(annotation);
    return classificationId !== undefined &&
      highlightedEntityClassifications.has(classificationId);
  });

  return entityAnnotation ?? annotations.find(isWord);
}
