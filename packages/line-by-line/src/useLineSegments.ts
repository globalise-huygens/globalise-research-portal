import { useMemo } from 'react';
import { segment, TextSegment } from '@knaw-huc/text-annotation-segmenter';
import {
  Annotation,
  findTextPositionSelector,
  getPageText,
  Id,
  indexLineNumbers,
  isEntity,
} from '@globalise/common/annotation';
import {
  filterAnnotationsWithSelector,
} from '@globalise/common/annotation';
import { orThrow } from '@globalise/common';
import { useCanvasIndexes } from '@globalise/common/document';

export type LineSegments = {
  pageText: string;
  segmentsByLine: Record<Id, TextSegment<Annotation>[]>;
  blockToLines: Record<Id, Id[]>;
  lineNumberById: Record<Id, number>;
};

export function useLineSegments(
  canvasId: string,
  annotations: Record<Id, Annotation>,
): LineSegments {
  const indexes = useCanvasIndexes(canvasId);

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
      blockToLines,
    } = indexes;
    const lineNumberById = indexLineNumbers(annotations);

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
      const lineSegment = word ? segment : beforeFirstLineBreak(segment);
      if (lineSegment.value) {
        segmentsByLine[lineId].push(lineSegment);
      }
    }

    return {
      pageText,
      segmentsByLine,
      blockToLines,
      lineNumberById,
    };
  }, [annotations, indexes]);
}

function beforeFirstLineBreak(
  segment: TextSegment<Annotation>,
): TextSegment<Annotation> {
  const breakIndex = segment.value.search(/[\r\n]/u);
  if (breakIndex === -1) {
    return segment;
  }
  return {
    ...segment,
    value: segment.value.slice(0, breakIndex),
  };
}
