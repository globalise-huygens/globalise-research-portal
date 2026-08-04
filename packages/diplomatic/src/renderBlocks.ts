import {
  Annotation,
  findSourceLabel,
  findSvgPath,
  parseSvgPath,
} from '@globalise/common/annotation';
import { Point } from '@knaw-huc/original-layout';
import { calcBoundingCorners, padCorners } from '@knaw-huc/original-layout';
import { createPath, createPoints, orThrow } from '@knaw-huc/original-layout';
import { Scale } from '@knaw-huc/original-layout';
import { select } from 'd3-selection';
import { px } from '@knaw-huc/original-layout';
import { D3El } from '@knaw-huc/original-layout';
import { createBlockBoundaries } from './createBlockBoundaries.ts';
import { Offset } from '@knaw-huc/original-layout';

type BlocksConfig = {
  scale: Scale;
  offset: Offset;
};

let nextTextMaskId = 0;

export function renderBlocks(
  annotations: Record<string, Annotation>,
  $view: HTMLElement,
  { scale, offset }: BlocksConfig,
) {
  const { width, height } = $view.getBoundingClientRect();
  const $svg = select($view)
    .append('svg')
    .attr('class', 'blocks')
    .style('margin-top', px(offset.top))
    .style('margin-left', px(offset.left))
    .attr('width', width - offset.left)
    .attr('height', height - offset.top);

  const words = Object.values(annotations).filter(
    (a) => a.textGranularity === 'word',
  );
  const textMaskId = `diplomatic-text-mask-${nextTextMaskId++}`;
  const $textMask = $svg
    .append('defs')
    .append('mask')
    .attr('id', textMaskId)
    .attr('maskUnits', 'userSpaceOnUse')
    .attr('maskContentUnits', 'userSpaceOnUse')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width - offset.left)
    .attr('height', height - offset.top);

  $textMask
    .append('rect')
    .attr('width', width - offset.left)
    .attr('height', height - offset.top)
    .attr('fill', 'white');

  const textMaskPath = words.map((word) => {
    const path = findSvgPath(word) ?? orThrow('No word path');
    const points = scale.path(createPoints(parseSvgPath(path)));
    return `M${createPath(points)}Z`;
  }).join(' ');

  $textMask
    .append('path')
    .attr('d', textMaskPath)
    .attr('fill', 'black')
    .attr('stroke', 'black')
    .attr('stroke-width', 4)
    .attr('vector-effect', 'non-scaling-stroke');

  const blocks = Object.fromEntries(
    Object.entries(annotations).filter(([, a]) => a.textGranularity === 'block'),
  );

  const blockBoundaries = createBlockBoundaries(words, annotations);
  const padding: Point = [50, 100];
  const blockCorners = Object.fromEntries(
    Object.entries(blockBoundaries).map(([id, block]) => {
      const corners = calcBoundingCorners(block);
      const padded = scale.path(padCorners(corners, padding));
      return [id, padded];
    }),
  );
  const $blocks: Record<string, D3El<SVGGElement>> = Object.fromEntries(
    Object.entries(blockCorners).map(([id, corners]) => {
      const block = blocks[id];
      const label = findSourceLabel(block);
      const $highlight = $svg.append('g')
        .attr('class', 'layout-element')
        .attr('data-selected', 'false');

      $highlight
        .append('polygon')
        .attr('class', 'layout-element-shape')
        .attr('mask', `url(#${textMaskId})`)
        .attr('points', createPath(corners))
        .attr('stroke-linejoin', 'miter');

      const blockTopLeft = corners[0];
      $highlight
        .append('text')
        .attr('class', 'layout-element-label')
        .attr('dominant-baseline', 'hanging')
        .attr('x', blockTopLeft[0] + scale(30))
        .attr('y', blockTopLeft[1] + scale(30))
        .style('font-size', px(scale(60)))
        .text(label);
      return [id, $highlight];
    }),
  );

  return { $blocks };
}
