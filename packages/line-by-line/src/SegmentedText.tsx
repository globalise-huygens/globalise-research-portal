import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';
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

      function handleMouseEnter(event: MouseEvent<HTMLSpanElement>) {
        event.stopPropagation();
        const previewAnchorElement = event.target instanceof HTMLElement
          ? event.target
          : event.currentTarget;
        showPreview(previewAnchorElement);
      }

      function handleMouseLeave(event: MouseEvent<HTMLSpanElement>) {
        event.stopPropagation();
        if (document.activeElement !== event.currentTarget) {
          setHovered(null);
        }
      }

      function handleFocus(event: FocusEvent<HTMLSpanElement>) {
        if (isEntityTrigger) {
          showPreview(event.currentTarget, true);
        }
      }

      function handleBlur() {
        setHovered(null);
      }

      function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
        if (
          isEntityTrigger &&
          hoverId &&
          (event.key === 'Enter' || event.key === ' ')
        ) {
          event.preventDefault();
          toggleClicked(hoverId);
        }
      }

      function handleClick(event: MouseEvent<HTMLSpanElement>) {
        if (hoverId && hoverId !== blockId) {
          event.stopPropagation();
          toggleClicked(hoverId);
        }
      }

      return (
        <span
          key={segment.index}
          tabIndex={isEntityTrigger ? 0 : undefined}
          role={isEntityTrigger ? 'button' : undefined}
          aria-label={isEntityTrigger ? `Preview entity: ${body}` : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
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
