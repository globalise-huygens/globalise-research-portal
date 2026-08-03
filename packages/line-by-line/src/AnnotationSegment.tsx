import { ReactNode, useEffect, useRef } from 'react';
import {
  Annotation,
  getEntityClassificationId,
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
};

export function AnnotationSegment(
  { canvasId, annotation, children }: AnnotationProps,
) {
  if (isEntity(annotation)) {
    return <EntitySegment canvasId={canvasId} annotation={annotation}>
      {children}
    </EntitySegment>;
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

function EntitySegment({ canvasId, annotation, children }: AnnotationProps) {
  const label = getEntityClassifiedAsLabel(annotation);
  const classificationId = getEntityClassificationId(annotation);
  const classifiedAs = getEntityClassifiedAsClassName(annotation);
  const category = getEntityTypeClassName(annotation);
  const isHighlighted =
    useIsEntityHighlightCategoryVisible(classificationId);
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
