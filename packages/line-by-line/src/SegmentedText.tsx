import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  Id,
} from '@globalise/common/annotation';
import {
  setHovered,
  toggleClicked,
  useEntityHighlightClassifications,
} from '@globalise/common/document';
import { AnnotationSegment } from './AnnotationSegment';
import { findHoverAnnotation } from './findHoverAnnotation';
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
      const annotationId = findHoverAnnotation(
        segment.annotations,
        highlightedEntityClassifications,
      )?.id
        ?? blockId
        ?? null;

      return (
        <span
          key={segment.index}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHovered(annotationId);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setHovered(blockId);
          }}
          onClick={(e) => {
            if (annotationId && annotationId !== blockId) {
              e.stopPropagation();
              toggleClicked(annotationId);
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
