import { ReactNode, useEffect, useRef } from 'react';
import {
  Annotation,
  getEntityTypeClassName,
  getEntityClassifiedAsLabel,
  getEntityClassifiedAsClassName,
  isEntity,
  isSearchResultAnnotation,
  toClassName,
  isWord,
} from '@globalise/common/annotation';
import {
  useDocumentStore,
  useIsEntityHighlightCategoryVisible,
  useIsSelectedInTranscription,
} from '@globalise/common/document';

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

  if (isSearchResultAnnotation(annotation)) {
    return <SearchResultSegment canvasId={canvasId} annotation={annotation}>
      {children}
    </SearchResultSegment>;
  }

  if (isWord(annotation)) {
    return <WordSegment annotation={annotation}>
      {children}
    </WordSegment>;
  }

  return <>{children}</>;
}

function WordSegment({ annotation, children }: Omit<AnnotationProps, 'canvasId'>) {
  const isSelected = useDocumentStore((s) => s.clickedId === annotation.id);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  return (
    <span
      ref={ref}
      className={`word${isSelected ? ' selected' : ''}`}
    >
      {children}
    </span>
  );
}

function SearchResultSegment(
  { canvasId, annotation, children }: AnnotationProps,
) {
  const isSelected = useIsSelectedInTranscription(canvasId, annotation.id);

  return (
    <span className={`search-result${isSelected ? ' selected' : ''}`}>
      {children}
    </span>
  );
}

function EntitySegment({ canvasId, annotation, children }: AnnotationProps) {
  const label = getEntityClassifiedAsLabel(annotation);
  const classifiedAs = getEntityClassifiedAsClassName(annotation);
  const category = getEntityTypeClassName(annotation);
  const isHighlighted = useIsEntityHighlightCategoryVisible(classifiedAs);
  const isSelected = useIsSelectedInTranscription(canvasId, annotation.id);

  if (!isHighlighted) {
    return <>{children}</>;
  }

  return (
    <span
      className={`entity ${category} ${classifiedAs} ${toClassName(label)}${isSelected ? ' selected' : ''}`}
      title={`${label} | ${annotation.id}`}
    >
      {children}
    </span>
  );
}
