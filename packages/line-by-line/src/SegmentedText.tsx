import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  getEntityClassificationId,
  Id,
  isEntity,
  isWord,
} from '@globalise/common/annotation';
import {
  setHovered,
  toggleClicked,
  useEntityHighlightCategories,
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
  const highlightedEntityCategories = useEntityHighlightCategories();

  return <>
    {segments.map((segment) => {
      const body = segment.value;
      const hoveredAnnotation = segment.annotations.find((annotation) => {
        if (!isEntity(annotation)) {
          return false;
        }
        const classificationId = getEntityClassificationId(annotation);
        return classificationId !== undefined &&
          highlightedEntityCategories.has(classificationId);
      }) ?? segment.annotations.find(isWord);
      const hoverId = hoveredAnnotation?.id
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
