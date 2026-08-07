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
            // The segment wrapper may cover more than the highlighted entity
            // (especially for nested annotations). Anchor to the deepest
            // rendered element under the pointer whenever possible.
            const target = e.target instanceof HTMLElement
              ? e.target
              : e.currentTarget;
            const rect = target.getBoundingClientRect();
            setHovered(hoverId, {
              element: target,
              x: e.clientX, y: e.clientY,
              left: rect.left, top: rect.top, right: rect.right,
              bottom: rect.bottom, width: rect.width, height: rect.height,
            });
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            // Let the preview close (with its short bridge delay) instead of
            // replacing the entity anchor with the whole line's anchor.
            setHovered(null);
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
