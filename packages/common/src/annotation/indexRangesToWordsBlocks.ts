import { Annotation } from './AnnoModel';
import { findTextPositionSelector } from './findTextPositionSelector';
import { Id } from './Id';
import { orThrow } from '../util/orThrow.ts';

export type OffsetRange = {
  id: Id;
  start: number;
  end: number;
};

export type OverlapIndexes = {
  toWords: Record<Id, Id[]>;
  toBlock: Record<Id, Id>;
};

export const emptyOverlapIndexes: OverlapIndexes = {
  toWords: {},
  toBlock: {},
};

export function createWordRanges(
  annotations: Record<Id, Annotation>,
  pageAnnoId: Id,
): OffsetRange[] {
  const wordSelectors: OffsetRange[] = [];
  for (const annotation of Object.values(annotations)) {
    if (annotation.textGranularity !== 'word') {
      continue;
    }
    const { start, end } = findTextPositionSelector(annotation, pageAnnoId)
      ?? orThrow('No selector');
    wordSelectors.push({ id: annotation.id, start, end });
  }
  return wordSelectors;
}

/**
 * Map ranges to overlapping words and the block containing the first word
 */
export function indexRangesToWordsBlocks(
  ranges: OffsetRange[],
  wordSelectors: OffsetRange[],
  wordToBlock: Record<Id, Id>,
): OverlapIndexes {
  const toWords: Record<Id, Id[]> = {};
  const toBlock: Record<Id, Id> = {};

  if (!wordSelectors.length) {
    return { toWords, toBlock };
  }

  for (const { id, start, end } of ranges) {
    const overlapping = wordSelectors
      .filter((word) => word.start < end && word.end > start)
      .map((w) => w.id);

    if (!overlapping.length) {
      continue;
    }
    toWords[id] = overlapping;

    const blockId = wordToBlock[overlapping[0]];
    if (blockId) {
      toBlock[id] = blockId;
    }
  }

  return { toWords, toBlock };
}
