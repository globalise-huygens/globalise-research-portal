import { type AnnotationIndexes, type Id } from '@globalise/common/annotation';

export function addToSelection(
  selected: (Id | null)[],
  indexes: AnnotationIndexes | null,
): Id[] {
  if (!indexes) {
    return [];
  }
  const { classifiedToWords, wordToBlock, classifiedToBlock } = indexes;
  const ids: Id[] = [];
  for (const selectedId of selected) {
    if (!selectedId) {
      continue;
    }
    ids.push(selectedId);
    const wordsFromClassified = classifiedToWords[selectedId];
    if (wordsFromClassified) {
      ids.push(...wordsFromClassified);
    }
    const blockFromWord = wordToBlock[selectedId];
    if (blockFromWord) {
      ids.push(blockFromWord);
    }
    const blockFromClassified = classifiedToBlock[selectedId];
    if (blockFromClassified) {
      ids.push(blockFromClassified);
    }
  }
  return ids;
}
