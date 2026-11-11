import { TextSegment } from '@knaw-huc/text-annotation-segmenter';
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import {
  Annotation,
  ClassifiedCategory,
  findClassifiedTarget,
  Id,
  isClassified,
  isHiddenClassified,
} from '@globalise/common/annotation';
import {
  removeHoverAttribute,
  setHoverAttribute,
  setHovered,
  toggleClicked,
} from '@globalise/common/document';
import { cn } from '@globalise/design';
import { getAnnotationClassNames } from './getAnnotationClassNames';

type TextProps = {
  blockId: Id | null;
  segments: TextSegment<Annotation>[];
  highlightCategories: Set<ClassifiedCategory>;
  classifiedToWords: Record<Id, Id[]>;
  selectedIds: Id[];
  activeHitIds: Id[];
};

export function SegmentedText(
  {
    blockId, segments, highlightCategories, classifiedToWords, selectedIds, activeHitIds,
  }: TextProps,
) {
  return <>
    {segments.map((segment) => {
      const body = segment.value;
      const shownClassified = segment.annotations
        .filter((annotation) => !isHiddenClassified(annotation, highlightCategories));
      const hoveredAnnotation = findClassifiedTarget(
        shownClassified,
        classifiedToWords,
      );
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
          className={cn([
            ...getAnnotationClassNames(segment.annotations, highlightCategories),
            hasAnnotation(segment, selectedIds) && 'selected',
            hasAnnotation(segment, activeHitIds) && 'active-hit',
          ])}
        >
          {body}
        </span>
      );
    })}
  </>;
}

function hasAnnotation(segment: TextSegment<Annotation>, ids: Id[]): boolean {
  return segment.annotations.some((annotation) => ids.includes(annotation.id));
}
