import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  Id,
  isEntity,
  isHighlightedEntity,
  isWord,
} from '@globalise/common/annotation';
import {
  createHoverAnchor,
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
      const hoveredAnnotation = segment.annotations.find(
        (annotation) => isHighlightedEntity(
          annotation, highlightedEntityCategories,
        ),
      ) ?? segment.annotations.find(isWord);
      const hoverId = hoveredAnnotation?.id
        ?? blockId
        ?? null;
      const isEntityTrigger = hoveredAnnotation
        ? isEntity(hoveredAnnotation)
        : false;

      function showPreview(element: Element, openImmediately = false) {
        setHovered(
          hoverId,
          createHoverAnchor(element, openImmediately),
        );
      }

      return (
        <span
          key={segment.index}
          tabIndex={isEntityTrigger ? 0 : undefined}
          role={isEntityTrigger ? 'button' : undefined}
          aria-label={isEntityTrigger ? `Preview entity: ${body}` : undefined}
          onMouseEnter={(e) => {
            e.stopPropagation();
            // The segment wrapper may cover more than the highlighted entity
            // (especially for nested annotations). Anchor to the deepest
            // rendered element under the pointer whenever possible.
            const target = e.target instanceof HTMLElement
              ? e.target
              : e.currentTarget;
            showPreview(target);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            if (document.activeElement === e.currentTarget) {
              return;
            }
            // Let the preview close (with its short bridge delay) instead of
            // replacing the entity anchor with the whole line's anchor.
            setHovered(null);
          }}
          onFocus={(e) => {
            if (isEntityTrigger) {
              showPreview(e.currentTarget, true);
            }
          }}
          onBlur={() => setHovered(null)}
          onPointerDown={(e) => {
            if (isEntityTrigger && e.pointerType !== 'mouse') {
              showPreview(e.currentTarget, true);
            }
          }}
          onKeyDown={(e) => {
            if (
              isEntityTrigger &&
              hoverId &&
              (e.key === 'Enter' || e.key === ' ')
            ) {
              e.preventDefault();
              toggleClicked(hoverId);
            }
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
