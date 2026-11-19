import {
  Annotation,
  ClassifiedCategory,
  getClassifiedClassNames,
  getClassifiedType,
  Id,
  isClassified,
  isHiddenClassified,
  isSearchHit,
  isWord,
} from '@globalise/common/annotation';

type Layer = 'entity' | 'event' | 'search-hit' | 'word';

export function getAnnotationClassNames(
  annotations: Annotation[],
  highlightCategories: Set<ClassifiedCategory>,
  selectedIds: Id[],
): string[] {
  return annotations.flatMap((annotation) => {
    const layer = getLayer(annotation, highlightCategories);
    if (!layer) {
      return [];
    }
    const classNames = isClassified(annotation) ? getClassifiedClassNames(annotation) : [layer];
    return selectedIds.includes(annotation.id) ? [...classNames, `selected-${layer}`] : classNames;
  });
}

function getLayer(
  annotation: Annotation,
  highlightCategories: Set<ClassifiedCategory>,
): Layer | undefined {
  if (isHiddenClassified(annotation, highlightCategories)) {
    return undefined;
  }
  if (isClassified(annotation)) {
    return getClassifiedType(annotation);
  }
  if (isSearchHit(annotation)) {
    return 'search-hit';
  }
  if (isWord(annotation)) {
    return 'word';
  }
  return undefined;
}
