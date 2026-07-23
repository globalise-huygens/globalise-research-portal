import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  type EntityVisualCategoryClassName,
  getEntityClassifiedAsClassName,
  getEntityClassifiedAsLabel,
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
      const interactiveAnnotation = selectAnnotation(
        segment.annotations,
        highlightedEntityCategories,
      );
      const interactionId = interactiveAnnotation?.id ?? null;
      const hoverId = interactionId ?? blockId ?? null;
      const isFirstInteractionSegment = interactionId
        ? !previousAnnotationIds.has(interactionId)
        : false;

      return (
        <span
          key={segment.index}
          aria-label={interactiveAnnotation
            ? getInteractionLabel(interactiveAnnotation, body)
            : undefined}
          className={interactiveAnnotation ? 'interactive-segment' : undefined}
          role={interactiveAnnotation ? 'button' : undefined}
          tabIndex={isFirstInteractionSegment ? 0 : undefined}
          onBlur={() => { setHovered(blockId); }}
          onFocus={() => { setHovered(hoverId); }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHovered(hoverId);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setHovered(blockId);
          }}
          onClick={(e) => {
            if (interactionId) {
              e.stopPropagation();
              toggleClicked(interactionId);
            }
          }}
          onKeyDown={(event) => {
            if (
              interactionId
              && (event.key === 'Enter' || event.key === ' ')
            ) {
              event.preventDefault();
              toggleClicked(interactionId);
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
): Annotation | undefined {
  const entity = annotations.find((a) =>
    isEntity(a) &&
    highlightedEntityCategories.has(getEntityClassifiedAsClassName(a)),
  );
  if (entity) {
    return entity;
  }
  const word = annotations.find((a) => isWord(a));
  if (word) {
    return word;
  }
}

function getInteractionLabel(annotation: Annotation, text: string) {
  return isEntity(annotation)
    ? `${getEntityClassifiedAsLabel(annotation)}: ${text}`
    : `Word: ${text}`;
}
