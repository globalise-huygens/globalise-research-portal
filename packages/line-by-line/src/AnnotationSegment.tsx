import { ReactNode, useEffect, useRef } from 'react';
import {
  Annotation,
  getEntityCategoryClassName,
  getEntityType,
  getEntityVisualCategoryClassName,
  isEntity,
  toClassName,
  isWord,
} from '@globalise/common/annotation';
import {
  useDocumentStore,
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
  const entityType = getEntityType(annotation);
  const entityCategory = getEntityCategoryClassName(annotation);
  const visualCategory = getEntityVisualCategoryClassName(annotation);
  const isSelected = useIsSelectedInTranscription(canvasId, annotation.id);
  return (
    <span
      className={`entity ${entityCategory} ${visualCategory} ${toClassName(entityType)}${isSelected ? ' selected' : ''}`}
      title={`${entityType} | ${annotation.id}`}
    >
      {children}
    </span>
  );
}
