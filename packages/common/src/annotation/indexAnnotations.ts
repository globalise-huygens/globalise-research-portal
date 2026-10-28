import { Id } from './Id';
import { Annotation } from './AnnoModel';
import { isClassified } from './ClassifiedModel';
import { findResourceTarget } from './findResourceTarget.ts';
import { findTextPositionSelector } from './findTextPositionSelector';
import { orThrow } from '../util/orThrow.ts';

export type AnnotationIndexes = {
  wordToLine: Record<Id, Id>;
  lineToBlock: Record<Id, Id>;
  blockToLines: Record<Id, Id[]>;
  wordToBlock: Record<Id, Id>;
  classifiedToWords: Record<Id, Id[]>;
  classifiedToBlock: Record<Id, Id>;
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

  const wordSelectors: WordSelector[] = [];
  for (const annotation of Object.values(annotations)) {
    if (annotation.textGranularity === 'word') {
      const { start, end } =
        findTextPositionSelector(annotation, pageAnnoId) ??
      orThrow('No selector');
      wordSelectors.push({ id: annotation.id, start, end });
    }
  }

  const classified = Object.values(annotations).filter(isClassified);
  const classifiedToWords = mapToWords(classified, wordSelectors, pageAnnoId);
  const classifiedToBlock: Record<Id, Id> = {};
  for (const [classifiedId, wordIds] of Object.entries(classifiedToWords)) {
    const blockId = wordToBlock[wordIds[0]];
    if (blockId) {
      classifiedToBlock[classifiedId] = blockId;
    }
  }

  return {
    wordToLine,
    lineToBlock,
    blockToLines,
    wordToBlock,
    classifiedToWords,
    classifiedToBlock,
  };
}

type WordSelector = { id: Id; start: number; end: number };

function mapToWords(
  annotations: Annotation[],
  wordSelectors: WordSelector[],
  pageAnnoId: Id,
): Record<Id, Id[]> {
  const annotationToWords: Record<Id, Id[]> = {};
  for (const annotation of annotations) {
    const { start, end } =
      findTextPositionSelector(annotation, pageAnnoId)
      ?? orThrow('No selector');
    const overlapping = wordSelectors
      .filter((word) => word.start < end && word.end > start)
      .map((word) => word.id);
    if (overlapping.length) {
      annotationToWords[annotation.id] = overlapping;
    }
  }
  return annotationToWords;
}