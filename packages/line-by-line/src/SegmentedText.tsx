import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import {
  Annotation,
  Id,
  isClassified,
  isEvent,
  isHighlighted,
  isWord,
} from '@globalise/common/annotation';
import {
  removeHoverAttribute,
  setHoverAttribute,
  setHovered,
  toggleClicked,
  useHighlightCategories,
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
  const highlightCategories = useHighlightCategories();

  return <>
    {segments.map((segment) => {
      const body = segment.value;
      const hoveredAnnotation = segment.annotations.find(
        (annotation) => isHighlighted(annotation, highlightCategories),
      ) ?? segment.annotations.find(isWord);
      const hoverId = hoveredAnnotation?.id
        ?? blockId
        ?? null;
      const isClassifiedTrigger = hoveredAnnotation
        ? isClassified(hoveredAnnotation)
        : false;

      function showPreview(element: Element, openImmediately = false) {
        setHoverAttribute(element, openImmediately ? 'immediate' : 'delayed');
        setHovered(hoverId);
      }

      function hidePreview(element: Element) {
        removeHoverAttribute(element);
        setHovered(null);
      }

      function handleMouseEnter(event: MouseEvent<HTMLSpanElement>) {
        event.stopPropagation();
        showPreview(event.currentTarget);
      }

      function handleMouseLeave(event: MouseEvent<HTMLSpanElement>) {
        event.stopPropagation();
        if (document.activeElement !== event.currentTarget) {
          hidePreview(event.currentTarget);
        }
      }

      function handleFocus(event: FocusEvent<HTMLSpanElement>) {
        if (isClassifiedTrigger) {
          showPreview(event.currentTarget, true);
        }
      }

      function handleBlur(event: FocusEvent<HTMLSpanElement>) {
        hidePreview(event.currentTarget);
      }

      function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
        if (
          isClassifiedTrigger &&
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
          tabIndex={isClassifiedTrigger ? 0 : undefined}
          role={isClassifiedTrigger ? 'button' : undefined}
          aria-haspopup={isClassifiedTrigger ? 'dialog' : undefined}
          aria-label={isClassifiedTrigger ? `Select: ${body}` : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
        >
          <NestedSegment
            annotations={withEventsInnermost(segment.annotations)}
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

function withEventsInnermost(annotations: Annotation[]): Annotation[] {
  return [
    ...annotations.filter(isEvent),
    ...annotations.filter((annotation) => !isEvent(annotation)),
  ];
}
