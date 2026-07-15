import { ReactNode, useEffect, useRef } from 'react';
import {
  Annotation,
  getEntityTypeClassName,
  getEntityClassifiedAsLabel,
  getEntityClassifiedAsClassName,
  isEntity,
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
  joinedBefore?: boolean;
  joinedAfter?: boolean;
};

export function AnnotationSegment(
  { canvasId, annotation, children, joinedBefore, joinedAfter }: AnnotationProps,
) {
  if (isEntity(annotation)) {
    return <EntitySegment
      canvasId={canvasId}
      annotation={annotation}
      joinedBefore={joinedBefore}
      joinedAfter={joinedAfter}
    >
      {children}
    </EntitySegment>;
  }

  if (isWord(annotation)) {
    return <WordSegment
      canvasId={canvasId}
      annotation={annotation}
      joinedBefore={joinedBefore}
      joinedAfter={joinedAfter}
    >
      {children}
    </WordSegment>;
  }

  return <>{children}</>;
}

function WordSegment(
  { canvasId, annotation, children, joinedBefore, joinedAfter }: AnnotationProps,
) {
  const isClicked = useDocumentStore((s) => s.clickedId === annotation.id);
  const isSelected = useIsSelectedInTranscription(canvasId, annotation.id);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isClicked && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isClicked]);

  return (
    <span
      ref={ref}
      className={getSegmentClassName('word', isSelected, joinedBefore, joinedAfter)}
    >
      {children}
    </span>
  );
}

function EntitySegment(
  { canvasId, annotation, children, joinedBefore, joinedAfter }: AnnotationProps,
) {
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
      className={`${getSegmentClassName('entity', isSelected, joinedBefore, joinedAfter)} ${category} ${classifiedAs} ${toClassName(label)}`}
      title={`${label} | ${annotation.id}`}
    >
      {children}
    </span>
  );
}

function getSegmentClassName(
  base: string,
  selected: boolean,
  joinedBefore?: boolean,
  joinedAfter?: boolean,
): string {
  return [
    base,
    selected && 'selected',
    joinedBefore && 'joined-before',
    joinedAfter && 'joined-after',
  ].filter(Boolean).join(' ');
}
