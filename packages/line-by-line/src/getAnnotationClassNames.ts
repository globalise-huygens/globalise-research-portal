import {
  Annotation,
  ClassifiedCategory,
  getClassifiedClassNames,
  isClassified,
  isHighlighted,
  isSearchHit,
  isWord,
} from '@globalise/common/annotation';

export function getAnnotationClassNames(
  annotations: Annotation[],
  highlightCategories: Set<ClassifiedCategory>,
): string[] {
  return annotations.flatMap((annotation) => getClassNames(annotation, highlightCategories));
}

function getClassNames(
  annotation: Annotation,
  highlightCategories: Set<ClassifiedCategory>,
): string[] {
  if (isClassified(annotation) && isHighlighted(annotation, highlightCategories)) {
    return getClassifiedClassNames(annotation);
  }
  if (isSearchHit(annotation)) {
    return ['search-hit'];
  }
  if (isWord(annotation)) {
    return ['word'];
  }
  return [];
}
