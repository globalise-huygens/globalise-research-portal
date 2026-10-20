import { ReactNode, useEffect, useRef } from 'react';
import {
  Annotation,
  getEntityAnnotationBodyClassName,
  getCidocEntityClassifiedAsLabel,
  getCidocClassName,
  isEntity,
  isSearchHit,
  toClassName,
  isWord,
} from '@globalise/common/annotation';
import {
  useIsClickedInLineByLine,
  useIsHighlightedEntity,
  useIsActiveHitInLineByLine,
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
  if (isEntity(annotation)) {
    return <EntitySegment canvasId={canvasId} annotation={annotation}>
      {children}
    </EntitySegment>;
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

function EntitySegment({ canvasId, annotation, children }: AnnotationProps) {
  const label = getCidocEntityClassifiedAsLabel(annotation);
  const classifiedAs = getCidocClassName(annotation);
  const category = getEntityAnnotationBodyClassName(annotation);
  const isHighlightedEntity = useIsHighlightedEntity(annotation);
  const isSelected = useIsSelectedInLineByLine(canvasId, annotation.id);

  if (!isHighlightedEntity) {
    return <>{children}</>;
  }

  return (
    <span
      className={`entity ${category} ${classifiedAs} ${toClassName(label)}${isSelected ? ' selected' : ''}`}
    >
      {children}
    </span>
  );
}
