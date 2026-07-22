import {
  Annotation,
  filterAnnotationsWithSelector,
  getEntityTypeClassName,
  type EntityVisualCategoryClassName,
  findTextSelectorRange,
  getEntityClassifiedAsLabel,
  getEntityClassifiedAsClassName,
  getPageText,
  indexLineNumbers,
  indexAnnotations,
  isEntity,
  toClassName,
} from '@globalise/common/annotation';
import { noop, orThrow } from '@globalise/common';
import {
  D3El,
  FullOriginalLayoutConfig,
  Id,
  OriginalLayoutConfig,
  Point,
  px,
  renderOriginalLayout,
} from '@knaw-huc/original-layout';
import {
  collectGroupSegments,
  groupSegments,
  segment,
} from '@knaw-huc/text-annotation-segmenter';
import { renderLineNumbers } from './renderLineNumbers';
import { renderBlocks } from './renderBlocks';
import { createFragment } from './createFragment.ts';

export type FullDiplomaticViewConfig = FullOriginalLayoutConfig & {
  showBlocks: boolean;
};

export const defaultConfig: FullDiplomaticViewConfig = {
  showBoundaries: false,
  showScanMargin: false,
  fit: 'width',
  page: {
    height: 0,
    width: 0,
  },
  showBlocks: false,
};

export type DiplomaticViewConfig = OriginalLayoutConfig &
  Partial<FullDiplomaticViewConfig> & {
    highlightedEntityCategories?: Set<EntityVisualCategoryClassName>;
    onHover?: (id: Id | null) => void;
    onClick?: (id: Id) => void;
  };

export function renderDiplomaticView(
  $view: HTMLDivElement,
  annotations: Record<Id, Annotation>,
  config: DiplomaticViewConfig,
) {
  $view.classList.add('original-layout');

  const mergedConfig = {
    onHover: noop, onClick: noop, ...defaultConfig, ...config,
  };
  const {
    highlightedEntityCategories,
    showBlocks,
    onHover,
    onClick,
  } = mergedConfig;
  $view.innerHTML = '';

  const $layoutView = document.createElement('div');
  $view.appendChild($layoutView);
  $layoutView.style.width = '100%';
  if (showBlocks) {
    $layoutView.classList.add('with-blocks');
  }

  const wordAnnos = Object.values(annotations)
    .filter((a) => a.textGranularity === 'word');
  const fragments = wordAnnos.map(createFragment);
  const originalLayout = renderOriginalLayout($layoutView, fragments, config);
  const { $fragments, scale, offset } = originalLayout;

  const { id: pageAnnoId, text: pageText } = getPageText(annotations);

  const entityAnnos = Object.values(annotations).filter(isEntity);
  const markedAnnos = filterAnnotationsWithSelector(
    [...wordAnnos, ...entityAnnos],
    pageAnnoId,
  );

  const textSegments = segment(pageText, markedAnnos, (a) => {
    const selector = findTextSelectorRange(a, pageAnnoId, pageText)
      ?? orThrow('No selector');
    return { start: selector.start, end: selector.end };
  });
  const groupedByWord = groupSegments(
    textSegments,
    (a) => a.textGranularity === 'word',
    (a) => a.id,
  );

  const { blockToLines, wordToBlock, wordToLine } = indexAnnotations(
    annotations,
    pageAnnoId,
    pageText,
  );
  const lineNumberById = indexLineNumbers(annotations);
  const $entityToSegments: Record<Id, HTMLSpanElement[]> = {};
  const keyboardInteractionIds = new Set<Id>();

  function makeSegmentInteractive(
    $segment: HTMLSpanElement,
    id: Id,
    label: string,
    blurId: Id | null,
  ) {
    $segment.setAttribute('aria-label', label);
    $segment.setAttribute('role', 'button');
    $segment.tabIndex = keyboardInteractionIds.has(id) ? -1 : 0;
    keyboardInteractionIds.add(id);
    $segment.addEventListener('click', () => onClick(id));
    $segment.addEventListener('mouseenter', () => onHover(id));
    $segment.addEventListener('mouseleave', () => onHover(blurId));
    $segment.addEventListener('focus', () => onHover(id));
    $segment.addEventListener('blur', () => onHover(blurId));
    $segment.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick(id);
      }
    });
  }

  for (const wordGroup of groupedByWord) {
    if (!wordGroup.isGroup) {
      continue;
    }

    const wordId = wordGroup.annotation.id;
    const $word = $fragments[wordId];
    const wordSegments = collectGroupSegments(wordGroup);
    const $segments: HTMLSpanElement[] = [];

    for (const segment of wordSegments) {
      const $segment = document.createElement('span');
      $segments.push($segment);
      $segment.classList.add('segment');
      const lineId = wordToLine[wordId] ?? '';
      const lineNumber = lineNumberById[lineId];
      $segment.dataset.lineId = lineId;
      if (lineNumber) {
        $segment.dataset.copyLineNumber = `${lineNumber}`;
        $segment.dataset.copyTextStart = `${segment.start}`;
      }
      $segment.textContent = pageText.substring(segment.start, segment.end);
      const entityAnno = segment.annotations.find((a) => isEntity(a));
      const visualCategory = entityAnno
        ? getEntityClassifiedAsClassName(entityAnno)
        : null;
      const isHighlightedEntity =
        entityAnno &&
        visualCategory &&
        (
          !highlightedEntityCategories ||
          highlightedEntityCategories.has(visualCategory)
        );

      if (isHighlightedEntity) {
        const entityLabel = toClassName(getEntityClassifiedAsLabel(entityAnno));
        const entityType = getEntityTypeClassName(entityAnno);
        $segment.classList.add(
          ...[
            'entity',
            entityType,
            visualCategory,
            entityLabel,
          ],
        );
        $segment.title = `${entityLabel} | ${entityAnno.id}`;

        if (!$entityToSegments[entityAnno.id]) {
          $entityToSegments[entityAnno.id] = [];
        }
        $entityToSegments[entityAnno.id].push($segment);

        makeSegmentInteractive(
          $segment,
          entityAnno.id,
          `${getEntityClassifiedAsLabel(entityAnno)}: ${$segment.textContent}`,
          null,
        );
      } else {
        const blockId = wordToBlock[wordId];
        makeSegmentInteractive(
          $segment,
          wordId,
          `Word: ${$segment.textContent}`,
          blockId ?? null,
        );
      }
    }
    $word.replaceChildren(...$segments);
  }

  for (const $segments of Object.values($entityToSegments)) {
    markJoinedSegments($segments);
  }

  const selectedBlocks = new Set<Id>();
  let selectBlock: (id: Id) => void = () => console.warn('Not implemented');
  let deselectBlock: (id: Id) => void = () => console.warn('Not implemented');

  if (showBlocks) {
    const lineCount = Object.values(annotations)
      .filter((a) => a.textGranularity === 'line').length;
    const digitCount = String(lineCount).length;
    const lineNumberFontSize = Math.max(10, scale(50));
    const lineNumberGap = Math.max(6, scale(20));
    const lineNumberTextWidth = lineNumberFontSize * digitCount * 0.65;
    const lineNumberWidth = lineNumberGap + lineNumberTextWidth;

    $layoutView.style.width = `calc(100% - ${lineNumberWidth}px)`;
    $layoutView.style.marginLeft = px(lineNumberWidth);

    const { $blocks, $svg, blockCorners, blockMarkerXs } = renderBlocks(
      annotations,
      $layoutView,
      { scale, offset },
    );
    const lineNumbers = renderLineNumbers(annotations, $view, {
      scale,
      gap: lineNumberGap,
      fontSize: lineNumberFontSize,
      blockMarkerXs,
      offset: {
        left: offset.left + lineNumberWidth,
        top: offset.top,
      },
    });
    const { showLine, hideLine } = lineNumbers;

    function showBlock($block: D3El<SVGGElement>, lines: Id[]) {
      $block.attr('data-selected', 'true');
      lines.forEach((l) => showLine(l));
    }

    function hideBlock($block: D3El<SVGGElement>, lines: Id[]) {
      $block.attr('data-selected', 'false');
      lines.forEach((l) => hideLine(l));
    }

    for (const [blockId, $block] of Object.entries($blocks)) {
      $block.on('mouseenter', () => onHover(blockId));
      $block.on('mouseleave', () => onHover(null));
      $block.on('focus', () => onHover(blockId));
      $block.on('blur', () => onHover(null));
      $block.on('click', () => onClick(blockId));
      $block.on('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(blockId);
        }
      });
    }

    let hoveredLayoutBlockId: Id | null = null;
    $layoutView.addEventListener('pointermove', (event) => {
      if ((event.target as Element).closest('.segment')) {
        hoveredLayoutBlockId = null;
        return;
      }
      const svgRect = $svg.node()?.getBoundingClientRect();
      if (!svgRect) {
        return;
      }
      const pointer: Point = [
        event.clientX - svgRect.left,
        event.clientY - svgRect.top,
      ];
      const nextBlockId = Object.entries(blockCorners)
        .find(([, corners]) => isPointInPolygon(pointer, corners))?.[0]
        ?? null;
      if (nextBlockId !== hoveredLayoutBlockId) {
        hoveredLayoutBlockId = nextBlockId;
        onHover(nextBlockId);
      }
    });
    $layoutView.addEventListener('pointerleave', () => {
      hoveredLayoutBlockId = null;
      onHover(null);
    });

    selectBlock = (id: Id) => {
      const $block = $blocks[id];
      if (!$block) {
        return;
      }
      if (selectedBlocks.has(id)) {
        return;
      }
      selectedBlocks.add(id);
      const lines = blockToLines[id];
      showBlock($block, lines);
    };
    deselectBlock = (id: Id) => {
      const $block = $blocks[id];
      if (!$block) {
        return;
      }
      if (!selectedBlocks.has(id)) {
        return;
      }
      selectedBlocks.delete(id);
      const lines = blockToLines[id];
      hideBlock($block, lines);
    };
  }

  function selectAnnotation(id: Id) {
    const annotation = annotations[id] ?? orThrow('Not found');
    if (annotation.textGranularity === 'word') {
      const $word = $fragments[id];
      $word.classList.add('selected');
    } else if (annotation.textGranularity === 'block') {
      selectBlock(id);
    } else if (isEntity(annotation)) {
      const $segments = $entityToSegments[id];
      $segments?.forEach(($r) => { $r.classList.add('selected'); });
    } else {
      console.warn(`Select not implemented: ${annotation.textGranularity}`);
    }
  }

  function deselectAnnotation(id: Id) {
    const annotation = annotations[id] ?? orThrow('Not found');
    if (annotation.textGranularity === 'word') {
      const $word = $fragments[id];
      $word.classList.remove('selected');
    } else if (annotation.textGranularity === 'block') {
      deselectBlock(id);
    } else if (isEntity(annotation)) {
      const $segments = $entityToSegments[id];
      $segments?.forEach(($r) => $r.classList.remove('selected'));
    } else {
      console.warn(`Deselect not implemented: ${annotation.textGranularity}`);
    }
  }

  const selectedIds: Id[] = [];

  return {
    setSelected: (...ids: string[]) => {
      const selected = ids.filter((id) => !selectedIds.includes(id));
      const deselected = selectedIds.filter((id) => !ids.includes(id));

      selected.forEach((id) => selectAnnotation(id));
      deselected.forEach((id) => deselectAnnotation(id));

      selectedIds.length = 0;
      selectedIds.push(...ids);
    },
  };
}

function isPointInPolygon(point: Point, polygon: Point[]) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = yi > y !== yj > y
      && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (crosses) {
      inside = !inside;
    }
  }
  return inside;
}

function markJoinedSegments($segments: HTMLSpanElement[]) {
  for (let index = 0; index < $segments.length; index++) {
    const $segment = $segments[index];
    const previous = $segments[index - 1];
    const next = $segments[index + 1];
    const lineId = $segment.dataset.lineId;
    if (lineId && previous?.dataset.lineId === lineId) {
      $segment.classList.add('joined-before');
    }
    if (lineId && next?.dataset.lineId === lineId) {
      $segment.classList.add('joined-after');
    }
  }
}
