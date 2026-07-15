import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  type EntityVisualCategoryClassName,
  getEntityClassifiedAsClassName,
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
    {segments.map((segment, index) => {
      const body = segment.value;
      const previousAnnotationIds = new Set(
        segments[index - 1]?.annotations.map((annotation) => annotation.id),
      );
      const nextAnnotationIds = new Set(
        segments[index + 1]?.annotations.map((annotation) => annotation.id),
      );
      const hoverId = selectAnnotation(
        segment.annotations,
        highlightedEntityCategories,
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
                joinedBefore={previousAnnotationIds.has(annotation.id)}
                joinedAfter={nextAnnotationIds.has(annotation.id)}
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
  highlightedEntityCategories: Set<EntityVisualCategoryClassName>,
): Id | undefined {
  const entity = annotations.find((a) =>
    isEntity(a) &&
    highlightedEntityCategories.has(getEntityClassifiedAsClassName(a)),
  );
  if (entity) {
    return entity.id;
  }
  const word = annotations.find((a) => isWord(a));
  if (word) {
    return word.id;
  }
}
