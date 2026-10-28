import {
  Annotation,
  filterByTextSelectorOrLog,
  findTextPositionSelector,
  getClassifiedClassNames,
  getPageText,
  indexAnnotations,
  isClassified,
} from '@globalise/common/annotation';
import { removeHoverAttribute, setHoverAttribute } from '@globalise/common/document';
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

  const classifiedAnnos = Object.values(annotations).filter(isClassified);
  const markedAnnos = filterByTextSelectorOrLog(
    [...wordAnnos, ...classifiedAnnos],
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

  const { blockToLines, wordToBlock } = indexAnnotations(annotations, pageAnnoId);
  const $classifiedToSegments: Record<Id, HTMLSpanElement[]> = {};

  function getClassifiedSegment(event: FocusEvent) {
    if (!(event.target instanceof HTMLSpanElement)) {
      return null;
    }

    return event.target.dataset.classifiedId
      ? event.target
      : null;
  }

  function handleClassifiedFocus(event: FocusEvent) {
    const $segment = getClassifiedSegment(event);
    if ($segment) {
      setHoverAttribute($segment);
      onHover($segment.dataset.classifiedId ?? null);
    }
  }

  function handleClassifiedBlur(event: FocusEvent) {
    const $segment = getClassifiedSegment(event);
    if ($segment) {
      removeHoverAttribute($segment);
      onHover(null);
    }
  }

  $layoutView.addEventListener('focusin', handleClassifiedFocus);
  $layoutView.addEventListener('focusout', handleClassifiedBlur);

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
      for (const annotation of segment.annotations.filter(isClassified)) {
        $segment.classList.add(...getClassifiedClassNames(annotation));
      }
      const classified = segment.annotations.find(isClassified);

      if (classified) {
        $segment.tabIndex = 0;
        $segment.dataset.classifiedId = classified.id;
        $segment.setAttribute('role', 'button');
        $segment.setAttribute('aria-haspopup', 'dialog');
        $segment.setAttribute(
          'aria-label',
          `Select: ${$segment.textContent}`,
        );

        if (!$classifiedToSegments[classified.id]) {
          $classifiedToSegments[classified.id] = [];
        }
        $classifiedToSegments[classified.id].push($segment);

        $segment.addEventListener('click', () => onClick(classified.id));
        $segment.addEventListener('mouseenter', () => {
          setHoverAttribute($segment, 'delayed');
          onHover(classified.id);
        });
        $segment.addEventListener('mouseleave', () => {
          if (document.activeElement !== $segment) {
            removeHoverAttribute($segment);
            onHover(null);
          }
        });
        $segment.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick(classified.id);
          }
        });
      } else {
        const blockId = wordToBlock[wordId];
        $segment.addEventListener('click', () => onClick(wordId));
        $segment.addEventListener('mouseenter', () => {
          setHoverAttribute($segment, 'delayed');
          onHover(wordId);
        });
        $segment.addEventListener('mouseleave', () => {
          removeHoverAttribute($segment);
          onHover(blockId ?? null);
        });
      }
    }
    $word.replaceChildren(...$segments);
  }

  const selectedBlocks = new Set<Id>();
  let selectBlock: (id: Id) => void = () => console.warn('Not implemented');
  let deselectBlock: (id: Id) => void = () => console.warn('Not implemented');

  if (showBlocks) {
    const lineCount = Object.values(annotations)
      .filter((a) => a.textGranularity === 'line').length;
    const digitCount = String(lineCount).length;
    const lineNumberGap = scale(30);
    const lineNumberWidth = lineNumberGap + scale(30 * digitCount);

    $layoutView.style.width = `calc(100% - ${lineNumberWidth}px)`;
    $layoutView.style.marginLeft = px(lineNumberWidth);

    const { $blocks } = renderBlocks(annotations, $view, { scale, offset });
    const lineNumbers = renderLineNumbers(annotations, $view, {
      scale, gap: lineNumberGap, offset,
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
    }

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
    } else if (isClassified(annotation)) {
      const $segments = $classifiedToSegments[id];
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
    } else if (isClassified(annotation)) {
      const $segments = $classifiedToSegments[id];
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
