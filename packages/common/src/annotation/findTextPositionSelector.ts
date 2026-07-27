import { Annotation, SpecificResourceTarget } from './AnnoModel';
import { isSpecificResourceTarget } from './isSpecificResourceTarget';
import { TextPositionSelector } from '@iiif/presentation-3';
import { Id } from './Id.ts';
import { asArray } from './asArray.ts';

export function findTextPositionSelector(
  annotation: Annotation,
  targetId: Id,
): TextPositionSelector | undefined {
  const targets = asArray(annotation.target);
  const resourceTarget = targets.find((t) => isSpecificResourceTarget(t) && t.source.id === targetId) as SpecificResourceTarget | undefined;
  if(!resourceTarget) {
    return;
  }
  const selectors = asArray(resourceTarget.selector);
  return selectors.find(isTextPositionSelector);
}

export function isTextPositionSelector(
  toTest: unknown,
): toTest is TextPositionSelector {
  return !!toTest
    && typeof toTest === 'object'
    && 'type' in toTest
    && toTest.type === 'TextPositionSelector';
}
