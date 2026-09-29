import { TextPositionSelector } from '@iiif/presentation-3';
import { Annotation, SpecificResourceTarget, TextualBody } from './AnnoModel';
import { Id } from './Id';
import { getBody } from './getBody';
import { isTextualBody } from './isTextualBody';
import { isSpecificResourceTarget } from './isSpecificResourceTarget';
import { isTextPositionSelector } from './findTextPositionSelector';
import { asArray } from '../util/asArray';

export function findTextRanges(
  annotations: Record<Id, Annotation>,
): Annotation<TextualBody>[] {
  return Object
    .values(annotations)
    .filter(isTextRange);
}

export function isTextRange(
  annotation: Annotation,
): annotation is Annotation<TextualBody> {
  return isTextualBody(getBody(annotation))
    && !!findTextRangeSelector(annotation);
}

export function findTextRangeSelector(
  annotation: Annotation,
): TextPositionSelector | undefined {
  if (!asArray(annotation.motivation).includes('describing')) {
    return;
  }
  const target = asArray(annotation.target)
    .find(isSpecificResourceTarget) as SpecificResourceTarget | undefined;
  return asArray(target?.selector).find(isTextPositionSelector);
}
