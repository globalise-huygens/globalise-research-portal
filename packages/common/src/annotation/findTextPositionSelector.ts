import { Annotation, SpecificResourceTarget } from './AnnoModel';
import { isSpecificResourceTarget } from './isSpecificResourceTarget';
import { TextPositionSelector } from '@iiif/presentation-3';
import { Id } from './Id.ts';
import { asArray } from './asArray.ts';

export type TextSelectorRange = {
  start: number;
  end: number;
};

type TextQuoteSelector = {
  type: 'TextQuoteSelector';
  exact: string;
};

export function findTextPositionSelector(
  annotation: Annotation,
  targetId: Id,
): TextPositionSelector | undefined {
  const resourceTarget = findResourceTarget(annotation, targetId);
  if (!resourceTarget) {
    return;
  }
  const selectors = asArray(resourceTarget.selector);
  return selectors.find(isTextPositionSelector);
}

export function findTextSelectorRange(
  annotation: Annotation,
  targetId: Id,
  text: string,
): TextSelectorRange | undefined {
  const position = findTextPositionSelector(annotation, targetId);
  if (!position) {
    return;
  }

  const quote = findTextQuoteSelector(annotation, targetId);
  if (!quote?.exact || text.slice(position.start, position.end) === quote.exact) {
    return position;
  }

  const correctedStart = findNearestQuoteStart(
    text,
    quote.exact,
    position.start,
  );
  if (correctedStart === undefined) {
    return position;
  }
  return {
    start: correctedStart,
    end: correctedStart + quote.exact.length,
  };
}

function findTextQuoteSelector(
  annotation: Annotation,
  targetId: Id,
): TextQuoteSelector | undefined {
  const resourceTarget = findResourceTarget(annotation, targetId);
  if (!resourceTarget) {
    return;
  }
  return asArray(resourceTarget.selector).find(isTextQuoteSelector) as
    TextQuoteSelector | undefined;
}

function findResourceTarget(
  annotation: Annotation,
  targetId: Id,
): SpecificResourceTarget | undefined {
  return asArray(annotation.target).find((target) =>
    isSpecificResourceTarget(target) && getSourceId(target.source) === targetId,
  ) as SpecificResourceTarget | undefined;
}

function getSourceId(source: unknown): string | undefined {
  if (typeof source === 'string') {
    return source;
  }
  if (source && typeof source === 'object' && 'id' in source) {
    return typeof source.id === 'string' ? source.id : undefined;
  }
}

function isTextQuoteSelector(toTest: unknown): toTest is TextQuoteSelector {
  return !!toTest
    && typeof toTest === 'object'
    && 'type' in toTest
    && toTest.type === 'TextQuoteSelector'
    && 'exact' in toTest
    && typeof toTest.exact === 'string';
}

function findNearestQuoteStart(
  text: string,
  exact: string,
  expectedStart: number,
): number | undefined {
  let nearest: number | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;
  let fromIndex = 0;

  while (fromIndex <= text.length - exact.length) {
    const found = text.indexOf(exact, fromIndex);
    if (found === -1) {
      break;
    }
    const distance = Math.abs(found - expectedStart);
    if (distance < nearestDistance) {
      nearest = found;
      nearestDistance = distance;
    }
    fromIndex = found + 1;
  }
  return nearestDistance <= 64 ? nearest : undefined;
}

export function isTextPositionSelector(
  toTest: unknown,
): toTest is TextPositionSelector {
  return !!toTest
    && typeof toTest === 'object'
    && 'type' in toTest
    && toTest.type === 'TextPositionSelector';
}
