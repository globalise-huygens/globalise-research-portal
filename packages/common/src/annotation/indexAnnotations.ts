import { Id } from './Id';
import { Annotation } from './AnnoModel';
import { isEntity } from './EntityModel';
import { findResourceTarget } from './findResourceTarget.ts';
import { findTextPositionSelector } from './findTextPositionSelector';
import {
  createWordRanges,
  indexRangesToWordsBlocks,
  type OffsetRange,
} from './indexRangesToWordsBlocks.ts';
import { orThrow } from '../util/orThrow.ts';

export type AnnotationIndexes = {
  wordToLine: Record<Id, Id>;
  lineToBlock: Record<Id, Id>;
  blockToLines: Record<Id, Id[]>;
  wordToBlock: Record<Id, Id>;
  entityToWords: Record<Id, Id[]>;
  entityToBlock: Record<Id, Id>;
  searchToWords: Record<Id, Id[]>;
  searchToBlock: Record<Id, Id>;
};

export function indexAnnotations(
  annotations: Record<Id, Annotation>,
  pageAnnoId: Id,
): AnnotationIndexes {
  const wordToLine: Record<Id, Id> = {};
  const lineToBlock: Record<Id, Id> = {};
  const blockToLines: Record<Id, Id[]> = {};

  for (const anno of Object.values(annotations)) {
    const target = findResourceTarget(anno);
    if (!target) {
      console.debug(`No resource target for ${anno.id}`);
      continue;
    }
    if (anno.textGranularity === 'word') {
      wordToLine[anno.id] = target.id;
    }
    if (anno.textGranularity === 'line') {
      const blockId = target.id;
      lineToBlock[anno.id] = blockId;
      if (!blockToLines[blockId]) {
        blockToLines[blockId] = [];
      }
      blockToLines[blockId].push(anno.id);
    }
  }

  const wordToBlock: Record<Id, Id> = {};
  for (const [wordId, lineId] of Object.entries(wordToLine)) {
    const blockId = lineToBlock[lineId];
    if (blockId) {
      wordToBlock[wordId] = blockId;
    }
  }

  const entityRanges: OffsetRange[] = [];
  for (const entity of Object.values(annotations)) {
    if (!isEntity(entity)) {
      continue;
    }
    const { start, end } = findTextPositionSelector(entity, pageAnnoId)
      ?? orThrow('No selector');
    entityRanges.push({ id: entity.id, start, end });
  }

  const wordRanges = createWordRanges(annotations, pageAnnoId);
  const { toWords: entityToWords, toBlock: entityToBlock } =
    indexRangesToWordsBlocks(
      entityRanges,
      wordRanges,
      wordToBlock,
    );

  return {
    wordToLine,
    lineToBlock,
    blockToLines,
    wordToBlock,
    entityToWords,
    entityToBlock,
    searchToWords: {},
    searchToBlock: {},
  };
}