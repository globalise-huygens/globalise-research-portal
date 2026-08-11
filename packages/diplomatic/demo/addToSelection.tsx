import { type AnnotationIndexes, type Id } from '@globalise/common/annotation';

export function addToSelection(
  selected: (Id | null)[],
  indexes: AnnotationIndexes | null,
): Id[] {
  if (!indexes) {
    return [];
  }
  const { entityToWords, wordToBlock, entityToBlock } = indexes;
  const ids: Id[] = [];
  for (const selectedId of selected) {
    if (!selectedId) {
      continue;
    }
    ids.push(selectedId);
    const wordsFromEntity = entityToWords[selectedId];
    if (wordsFromEntity) {
      ids.push(...wordsFromEntity);
    }
    const blockFromWord = wordToBlock[selectedId];
    if (blockFromWord) {
      ids.push(blockFromWord);
    }
    const blockFromEntity = entityToBlock[selectedId];
    if (blockFromEntity) {
      ids.push(blockFromEntity);
    }
  }
  return ids;
}
