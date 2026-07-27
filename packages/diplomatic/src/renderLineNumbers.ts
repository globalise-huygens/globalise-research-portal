import {
  Annotation,
  findSvgPath,
  findResourceTarget,
  indexLineNumbers,
  parseSvgPath,
} from '@globalise/common/annotation';
import { Id } from '@knaw-huc/original-layout';
import { Rect } from '@knaw-huc/original-layout';
import { calcBoundingBox } from '@knaw-huc/original-layout';
import { createPoints } from '@knaw-huc/original-layout';
import { orThrow } from '@knaw-huc/original-layout';
import { px } from '@knaw-huc/original-layout';
import { Scale } from '@knaw-huc/original-layout';
import { Offset } from '@knaw-huc/original-layout';

export type LineNumbersConfig = {
  scale: Scale;
  offset: Offset;
  gap: number;
  fontSize: number;
  blockMarkerXs: Record<Id, number>;
};

export function renderLineNumbers(
  annotations: Record<Id, Annotation>,
  $view: HTMLElement,
  { scale, offset, gap, fontSize, blockMarkerXs }: LineNumbersConfig,
) {
  const $container = document.createElement('div');
  $view.appendChild($container);
  $container.classList.add('line-numbers');
  $container.style.top = px(offset.top);
  $container.style.left = px(offset.left);

  const lineAnnos = Object.values(annotations).filter(
    (a) => a.textGranularity === 'line',
  );
  const lineNumberById = indexLineNumbers(annotations);
  const wordAnnos = Object.values(annotations).filter(
    (a) => a.textGranularity === 'word',
  );

  const wordsByLine = new Map<Id, Annotation[]>();
  for (const wordAnno of wordAnnos) {
    const target = findResourceTarget(wordAnno) ?? orThrow('No target');
    if (!wordsByLine.has(target.id)) {
      wordsByLine.set(target.id, []);
    }
    wordsByLine.get(target.id)?.push(wordAnno);
  }
  const lineToBlock: Record<Id, Id> = {};
  for (const line of lineAnnos) {
    const target = findResourceTarget(line);
    if (target) {
      lineToBlock[line.id] = target.id;
    }
  }
  const $lineNumbers: Record<Id, HTMLSpanElement> = {};

  for (const line of lineAnnos) {
    const words = wordsByLine.get(line.id);
    if (!words) {
      continue;
    }

    const leftMostWord = findLeftMostWord(words, scale);
    const blockLeftEdgeX = blockMarkerXs[lineToBlock[line.id]];

    const $lineNumber = document.createElement('span');
    $container.appendChild($lineNumber);
    $lineNumber.classList.add('line-number');
    $lineNumber.textContent = `${lineNumberById[line.id]}`;
    Object.assign($lineNumber.style, {
      left: px((blockLeftEdgeX ?? leftMostWord.left) - gap),
      top: px(leftMostWord.top + leftMostWord.height / 2),
      transform: 'translate(-100%, -50%)',
      fontSize: px(fontSize),
    });

    $lineNumbers[line.id] = $lineNumber;
  }

  function showLine(lineId: Id) {
    const $lineNumber = $lineNumbers[lineId];
    if ($lineNumber) {
      $lineNumber.classList.add('is-visible');
    }
  }

  function hideLine(lineId: Id) {
    const $lineNumber = $lineNumbers[lineId];
    if ($lineNumber) {
      $lineNumber.classList.remove('is-visible');
    }
  }

  return { showLine, hideLine };
}

function findLeftMostWord(
  words: Annotation[],
  scale: Scale,
): Rect {
  let leftMost: Rect | null = null;
  for (const word of words) {
    const svgPath = findSvgPath(word) ?? orThrow('No svg path');
    const bbox = calcBoundingBox(
      scale.path(createPoints(parseSvgPath(svgPath))),
    );
    if (!leftMost || bbox.left < leftMost.left) {
      leftMost = bbox;
    }
  }
  return leftMost ?? orThrow('No leftmost word found');
}
