import { Id } from './Id';
import { Annotation } from './AnnoModel';
import { isClassified } from './ClassifiedModel';
import { findResourceTarget } from './findResourceTarget.ts';
import { findTextPositionSelector } from './findTextPositionSelector';
import { orThrow } from '../util/orThrow.ts';
import { findWordsByOffsets, WordOffsets } from './findWordsByOffsets';

export type AnnotationIndexes = {
  wordToLine: Record<Id, Id>;
  lineToBlock: Record<Id, Id>;
  blockToLines: Record<Id, Id[]>;
  wordToBlock: Record<Id, Id>;
  classifiedToWords: Record<Id, Id[]>;
  classifiedToBlock: Record<Id, Id>;
  wordOffsets: WordOffsets[];
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

  const classifiedToWords: Record<Id, Id[]> = {};
  const classifiedToBlock: Record<Id, Id> = {};

  const wordOffsets: WordOffsets[] = [];
  for (const annotation of Object.values(annotations)) {
    if (annotation.textGranularity === 'word') {
      const { start, end } =
        findTextPositionSelector(annotation, pageAnnoId) ??
      orThrow('No selector');
      wordOffsets.push({ id: annotation.id, start, end });
    }
  }

  if (wordOffsets.length) {
    for (const classified of Object.values(annotations).filter(isClassified)) {
      const selector = findTextPositionSelector(classified, pageAnnoId)
        ?? orThrow('No selector');
      const wordIds = findWordsByOffsets(wordOffsets, selector);

      if (!wordIds.length) {
        continue;
      }
      classifiedToWords[classified.id] = wordIds;

      const blockId = wordToBlock[wordIds[0]];
      if (blockId) {
        classifiedToBlock[classified.id] = blockId;
      }
    }
  }

  return {
    wordToLine,
    lineToBlock,
    blockToLines,
    wordToBlock,
    classifiedToWords,
    classifiedToBlock,
    wordOffsets,
  };
}
