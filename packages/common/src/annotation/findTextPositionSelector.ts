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
  prefix?: string;
  suffix?: string;
};

const MAX_QUOTE_CORRECTION_DISTANCE = 64;

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

  const correctedStart = findQuoteStart(
    text,
    quote,
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
    && typeof toTest.exact === 'string'
    && (!('prefix' in toTest) || typeof toTest.prefix === 'string')
    && (!('suffix' in toTest) || typeof toTest.suffix === 'string');
}

function findQuoteStart(
  text: string,
  quote: TextQuoteSelector,
  expectedStart: number,
): number | undefined {
  const candidates: number[] = [];
  let fromIndex = 0;

  while (fromIndex <= text.length - quote.exact.length) {
    const found = text.indexOf(quote.exact, fromIndex);
    if (found === -1) {
      break;
    }
    if (Math.abs(found - expectedStart) <= MAX_QUOTE_CORRECTION_DISTANCE) {
      candidates.push(found);
    }
    fromIndex = found + 1;
  }

  const contextualCandidates = candidates.filter((start) =>
    matchesQuoteContext(text, quote, start),
  );
  const hasContext = quote.prefix !== undefined || quote.suffix !== undefined;
  const eligibleCandidates = hasContext
    ? contextualCandidates
    : candidates;

  if (!eligibleCandidates.length) {
    return;
  }

  const nearestDistance = Math.min(
    ...eligibleCandidates.map((start) => Math.abs(start - expectedStart)),
  );
  const nearestCandidates = eligibleCandidates.filter(
    (start) => Math.abs(start - expectedStart) === nearestDistance,
  );

  return nearestCandidates.length === 1 ? nearestCandidates[0] : undefined;
}

function matchesQuoteContext(
  text: string,
  quote: TextQuoteSelector,
  start: number,
) {
  const prefixMatches = quote.prefix === undefined
    || text.slice(Math.max(0, start - quote.prefix.length), start) === quote.prefix;
  const end = start + quote.exact.length;
  const suffixMatches = quote.suffix === undefined
    || text.slice(end, end + quote.suffix.length) === quote.suffix;

  return prefixMatches && suffixMatches;
}

export function isTextPositionSelector(
  toTest: unknown,
): toTest is TextPositionSelector {
  return !!toTest
    && typeof toTest === 'object'
    && 'type' in toTest
    && toTest.type === 'TextPositionSelector';
}
