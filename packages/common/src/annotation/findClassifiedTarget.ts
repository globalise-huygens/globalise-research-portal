import { Annotation } from './AnnoModel.ts';
import { isClassified } from './ClassifiedModel.ts';
import { isEntity } from './EntityModel.ts';
import { Id } from './Id.ts';
import { isWord } from './isWord.ts';

export function findClassifiedTarget(
  annotations: Annotation[],
  classifiedToWords: Record<Id, Id[]>,
): Annotation | undefined {
  const [shortestClassified] = annotations
    .filter(isClassified)
    .sort((a, b) => getSpan(a) - getSpan(b) || getTypeRank(a) - getTypeRank(b));
  return shortestClassified ?? annotations.find(isWord);

  function getSpan(annotation: Annotation): number {
    return classifiedToWords[annotation.id]?.length ?? 0;
  }
}

function getTypeRank(annotation: Annotation): number {
  return isEntity(annotation) ? 0 : 1;
}
