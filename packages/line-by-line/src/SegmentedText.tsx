import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  type EntityClassificationId,
  getEntityClassificationId,
  Id,
  isEntity,
  isWord,
} from '@globalise/common/annotation';
import {
  setHovered,
  toggleClicked,
  useEntityHighlightClassifications,
} from '@globalise/common/document';
import { AnnotationSegment } from './AnnotationSegment';
import { NestedSegment } from './NestedSegment';

type TextProps = {
  canvasId: string;
  blockId: Id | null;
  segments: TextSegment<Annotation>[];
};

export function SegmentedText(
  { canvasId, blockId, segments }: TextProps,
) {
  const highlightedEntityClassifications =
    useEntityHighlightClassifications();

  return <>
    {segments.map((segment) => {
      const body = segment.value;
      const hoverId = selectAnnotation(
        segment.annotations,
        highlightedEntityClassifications,
      )
        ?? blockId
        ?? null;

      return (
        <span
          key={segment.index}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHovered(hoverId);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setHovered(blockId);
          }}
          onClick={(e) => {
            if (hoverId && hoverId !== blockId) {
              e.stopPropagation();
              toggleClicked(hoverId);
            }
          }}
        >
          <NestedSegment
            annotations={segment.annotations}
            annotation={(annotation, children) => (
              <AnnotationSegment
                canvasId={canvasId}
                annotation={annotation}
              >
                {children}
              </AnnotationSegment>
            )}
          >
            {body}
          </NestedSegment>
        </span>
      );
    })}
  </>;
}

function selectAnnotation(
  annotations: Annotation[],
  highlightedEntityClassifications: Set<EntityClassificationId>,
): Id | undefined {
  const entity = annotations.find((annotation) => {
    if (!isEntity(annotation)) {
      return false;
    }
    const classificationId = getEntityClassificationId(annotation);
    return classificationId !== undefined &&
      highlightedEntityClassifications.has(classificationId);
  });
  if (entity) {
    return entity.id;
  }
  const word = annotations.find((a) => isWord(a));
  if (word) {
    return word.id;
  }
}
