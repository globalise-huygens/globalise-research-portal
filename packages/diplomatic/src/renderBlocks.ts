import { Annotation, findSourceLabel } from '@globalise/common/annotation';
import {
  calcBoundingCorners,
  createPath,
  D3El,
  Offset,
  padCorners,
  Point,
  px,
  Scale,
} from '@knaw-huc/original-layout';
import { createBlockBoundaries } from './createBlockBoundaries.ts';
import { select } from 'd3-selection';

type BlockColors = {
  stroke: string;
  fill: string;
};

type BlocksConfig = {
  scale: Scale;
  offset: Offset;
  colors?: BlockColors;
};

export function renderBlocks(
  annotations: Record<string, Annotation>,
  $view: HTMLElement,
  {
    scale,
    offset,
    colors = {
      stroke: 'var(--color-layout-element-stroke, rgb(18 94 100 / 0.38))',
      fill: 'var(--color-layout-element-fill, rgb(41 191 204 / 0.08))',
    },
  }: BlocksConfig,
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
  const blockBoundaries = createBlockBoundaries(words, annotations);
  const padding: Point = [50, 100];
  const leftTextClearance = Math.max(12, scale(50));
  const blockCorners = Object.fromEntries(
    Object.entries(blockBoundaries).map(([id, block]) => {
      const corners = calcBoundingCorners(block);
      const padded = scale.path(padCorners(corners, padding));
      padded[0] = [padded[0][0] - leftTextClearance, padded[0][1]];
      padded[3] = [padded[3][0] - leftTextClearance, padded[3][1]];
      return [id, padded];
    }),
  );
  const blockMarkerXs: Record<string, number> = {};
  const $blocks: Record<string, D3El<SVGGElement>> = Object.fromEntries(
    Object.entries(blockCorners).map(([id, corners]) => {
      const block = annotations[id];
      const label = block ? findSourceLabel(block) : 'Layout element';
      const $highlight = $svg.append('g')
        .attr('class', 'layout-block')
        .attr('data-selected', 'false')
        .attr('aria-label', label)
        .attr('role', 'button')
        .attr('tabindex', 0);

      const blockTopLeft = corners[0];
      const blockBottomLeft = corners[3];
      const markerX = blockTopLeft[0];
      blockMarkerXs[id] = markerX;

      $highlight
        .append('polygon')
        .attr('class', 'block-boundary')
        .attr('points', createPath(corners))
        .attr('fill', colors.fill)
        .attr('stroke', colors.stroke)
        .attr('stroke-width', 1.25)
        .attr('stroke-linejoin', 'miter')
        .attr('vector-effect', 'non-scaling-stroke');

      $highlight
        .append('line')
        .attr('class', 'block-hit-area')
        .attr('x1', markerX)
        .attr('y1', blockTopLeft[1])
        .attr('x2', markerX)
        .attr('y2', blockBottomLeft[1])
        .attr('vector-effect', 'non-scaling-stroke');

      $highlight
        .append('line')
        .attr('class', 'block-marker')
        .attr('x1', markerX)
        .attr('y1', blockTopLeft[1])
        .attr('x2', markerX)
        .attr('y2', blockBottomLeft[1])
        .attr('vector-effect', 'non-scaling-stroke');

      $highlight
        .append('text')
        .attr('class', 'block-label')
        .attr('dominant-baseline', 'hanging')
        .attr('x', markerX + Math.max(4, scale(16)))
        .attr('y', blockTopLeft[1] + Math.max(3, scale(12)))
        .style('font-size', px(Math.max(9, scale(42))))
        .text(label);

      return [id, $highlight];
    }),
  );

  return { $blocks, blockMarkerXs };
}
