import {
  type Annotation,
  type EntityClassificationId,
  hasEntityClassification,
  isEntity,
  isWord,
} from '@globalise/common/annotation';

export function findHoverAnnotation(
  annotations: Annotation[],
  highlightedEntityClassifications: ReadonlySet<EntityClassificationId>,
): Annotation | undefined {
  const entityAnnotation = annotations.find((annotation) =>
    isEntity(annotation) &&
    hasEntityClassification(
      annotation,
      highlightedEntityClassifications,
    ),
  );

  return entityAnnotation ?? annotations.find(isWord);
}
