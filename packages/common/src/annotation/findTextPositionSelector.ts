import { Annotation, SpecificResourceTarget } from './AnnoModel';
import { isSpecificResourceTarget } from './isSpecificResourceTarget';
import { TextPositionSelector } from '@iiif/presentation-3';
import { Id } from './Id.ts';
import { asArray } from './asArray.ts';

export function findTextPositionSelector(
  annotation: Annotation,
  targetId: Id,
): TextPositionSelector | undefined {
  const resourceTarget = findTargetForSource(annotation, targetId);
  if (!resourceTarget) {
    return;
  }
  const selectors = asArray(resourceTarget.selector);
  return selectors.find(isTextPositionSelector);
}

function findTargetForSource(
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

export function isTextPositionSelector(
  toTest: unknown,
): toTest is TextPositionSelector {
  return !!toTest
    && typeof toTest === 'object'
    && 'type' in toTest
    && toTest.type === 'TextPositionSelector';
}
