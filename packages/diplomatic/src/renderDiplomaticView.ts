import {
  Annotation,
  filterAnnotationsWithSelector,
  getEntityTypeClassName,
  type EntityVisualCategoryClassName,
  findTextPositionSelector,
  getEntityClassifiedAsLabel,
  getEntityClassifiedAsClassName,
  getPageText,
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
  // `original-layout` is required by the rendering dependency; the second
  // class owns the GLOBALISE-specific viewer styles.
  $view.classList.add('original-layout', 'diplomatic-view');

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
  const originalLayout = renderOriginalLayout(
    $layoutView,
    fragments,
    mergedConfig,
  );
  const { $fragments, scale, offset } = originalLayout;

  const { id: pageAnnoId, text: pageText } = getPageText(annotations);

  const entityAnnos = Object.values(annotations).filter(isEntity);
  const markedAnnos = filterAnnotationsWithSelector(
    [...wordAnnos, ...entityAnnos],
    pageAnnoId,
  );

  const textSegments = segment(pageText, markedAnnos, (a) => {
    const selector = findTextPositionSelector(a, pageAnnoId)
      ?? orThrow('No selector');
    return { start: selector.start, end: selector.end };
  });
  const groupedByWord = groupSegments(
    textSegments,
    (a) => a.textGranularity === 'word',
    (a) => a.id,
  );

  const { blockToLines, wordToBlock } = indexAnnotations(
    annotations,
    pageAnnoId,
  );
  const $entityToSegments: Record<Id, HTMLSpanElement[]> = {};
  function makeSegmentInteractive(
    $segment: HTMLSpanElement,
    id: Id,
    blurId: Id | null,
  ) {
    $segment.addEventListener('click', () => onClick(id));
    $segment.addEventListener('mouseenter', () => onHover(id));
    $segment.addEventListener('mouseleave', () => onHover(blurId));
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
          null,
        );
      } else {
        const blockId = wordToBlock[wordId];
        makeSegmentInteractive(
          $segment,
          wordId,
          blockId ?? null,
        );
      }
    }
    $word.replaceChildren(...$segments);
  }

  let selectBlock: (id: Id) => void = noop;
  let deselectBlock: (id: Id) => void = noop;

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

    const { $blocks, blockMarkerXs } = renderBlocks(
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
      $block.on('click', () => onClick(blockId));
    }

    selectBlock = (id: Id) => {
      const $block = $blocks[id];
      if (!$block) {
        return;
      }
      if ($block.attr('data-selected') === 'true') {
        return;
      }
      const lines = blockToLines[id] ?? [];
      showBlock($block, lines);
    };
    deselectBlock = (id: Id) => {
      const $block = $blocks[id];
      if (!$block) {
        return;
      }
      if ($block.attr('data-selected') !== 'true') {
        return;
      }
      const lines = blockToLines[id] ?? [];
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
