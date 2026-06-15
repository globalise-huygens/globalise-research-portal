import { useMemo } from 'react';
import { segment, TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  findTextPositionSelector,
  getPageText,
  Id,
  isEntity,
} from '@globalise/common/annotation';
import {
  filterAnnotationsWithSelector,
} from '@globalise/common/annotation';
import { orThrow } from '@globalise/common';
import { useDocumentStore } from '@globalise/common/document';

export type LineSegments = {
  pageText: string;
  lineIds: Id[];
  segmentsByLine: Record<Id, TextSegment<Annotation>[]>;
  linesToBlock: Record<Id, Id>;
  blockToLines: Record<Id, Id[]>;
};

export function useLineSegments(
  annotations: Record<Id, Annotation>,
): LineSegments {
  const indexes = useDocumentStore((s) => s.indexes);

  return useMemo(() => {
    const { id: pageAnnoId, text: pageText } = getPageText(annotations);

    const wordAnnos = Object.values(annotations).filter(
      (a) => a.textGranularity === 'word',
    );
    const entityAnnos = Object.values(annotations).filter(isEntity);
    const annos = filterAnnotationsWithSelector([...wordAnnos, ...entityAnnos], pageAnnoId);
    const segments = segment(pageText, annos, (a) => {
      const selector = findTextPositionSelector(a, pageAnnoId)
        ?? orThrow('No selector');
      return { start: selector.start, end: selector.end };
    });
    const {
      wordToLine,
      lineToBlock,
      blockToLines,
    } = indexes;

    const segmentsByLine: Record<Id, TextSegment<Annotation>[]> = {};
    let lastLineId: Id | null = null;

    for (const segment of segments) {
      const word = segment.annotations.find((a) => a.id in wordToLine);
      const lineId: Id | null = word ? wordToLine[word.id] : lastLineId;
      if (!lineId) {
        continue;
      }
      lastLineId = lineId;
      if (!segmentsByLine[lineId]) {
        segmentsByLine[lineId] = [];
      }
      segmentsByLine[lineId].push(segment);
    }

    const lineIds = Object.keys(segmentsByLine);

    return { pageText, lineIds, segmentsByLine, linesToBlock: lineToBlock, blockToLines };
  }, [annotations, indexes]);
}