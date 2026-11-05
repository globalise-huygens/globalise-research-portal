import { ReactNode, useEffect, useRef } from 'react';
import {
  Annotation,
  ClassifiedBody,
  getClassifiedClassNames,
  getCidocEntityClassificationId,
  getEntityPresentationFamilyByClassificationId,
  isClassified,
  isEntity,
  isEvent,
  isSearchHit,
  isWord,
} from '@globalise/common/annotation';
import {
  useIsClickedInLineByLine,
  useIsActiveHitInLineByLine,
  useIsHighlighted,
  useIsSelectedInLineByLine,
} from '@globalise/common/document';
import { cn } from '@globalise/design';

type AnnotationProps = {
  canvasId: string;
  annotation: Annotation;
  children: ReactNode;
};

export function AnnotationSegment(
  { canvasId, annotation, children }: AnnotationProps,
) {
  if (isClassified(annotation)) {
    return <ClassifiedSegment canvasId={canvasId} annotation={annotation}>
      {children}
    </ClassifiedSegment>;
  }

  if (isSearchHit(annotation)) {
    return <SearchHitSegment canvasId={canvasId} annotation={annotation}>
      {children}
    </SearchHitSegment>;
  }

  if (isWord(annotation)) {
    return <WordSegment canvasId={canvasId} annotation={annotation}>
      {children}
    </WordSegment>;
  }

  return <>{children}</>;
}

function WordSegment({ canvasId, annotation, children }: AnnotationProps) {
  const isSelected = useIsSelectedInLineByLine(canvasId, annotation.id);
  const isClicked = useIsClickedInLineByLine(canvasId, annotation.id);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isClicked && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isClicked]);

  return (
    <span
      ref={ref}
      className={`word${isSelected ? ' selected' : ''}`}
    >
      {children}
    </span>
  );
}

function SearchHitSegment({ canvasId, annotation, children }: AnnotationProps) {
  const isActiveHit = useIsActiveHitInLineByLine(canvasId, annotation.id);

  return (
    <span className={cn(['search-hit', isActiveHit && 'active-hit'])}>
      {children}
    </span>
  );
}

type ClassifiedProps = AnnotationProps & {
  annotation: Annotation<ClassifiedBody>;
};

function ClassifiedSegment({ canvasId, annotation, children }: ClassifiedProps) {
  const isHighlighted = useIsHighlighted(annotation);
  const isSelected = useIsClickedInLineByLine(canvasId, annotation.id);

  const family = isEntity(annotation)
    ? getCidocEntityClassificationId(annotation)
    : undefined;
  const familyClassName = family
    ? `annotation-${getEntityPresentationFamilyByClassificationId(family)}`
    : undefined;
  const classNames = getClassifiedClassNames(annotation).filter(
    (className) => className !== 'entity' && className !== 'event'
      && !className.startsWith('annotation-'),
  );

  return (
    <span
      className={cn([
        ...classNames,
        isEntity(annotation) && (isHighlighted ? 'entity' : 'entity-hidden'),
        isEvent(annotation) && (isHighlighted ? 'event' : 'event-hidden'),
        familyClassName,
        isSelected && 'selected',
      ])}
    >
      {children}
    </span>
  );
}
