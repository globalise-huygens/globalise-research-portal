import { extent } from 'd3-array';
import { scaleBand, scaleLinear, type ScaleBand, type ScaleLinear } from 'd3-scale';
import { TooltipTrigger, Tooltip, Focusable } from 'react-aria-components/Tooltip';
import { cn } from '@globalise/design';
import classes from './Histogram.module.css';

import type { Term } from './elasticsearch/rangeFacetItems.server';

const width = 300;
const height = 150;
const marginTop = 16;
const marginBottom = 8;

export default function Histogram({ terms, curMinMax }: { terms: Term[], curMinMax: [number, number] }) {
  const dataYears = terms.map((item) => item.start);
  const dataAmounts = terms.map((item) => item.count);

  const x = scaleBand(dataYears, [0, width]).paddingInner(0.05);
  const y = scaleLinear(extent(dataAmounts) as [number, number], [height - marginBottom, marginTop]);

  return (
    <svg className={classes.histogram} viewBox={`0 0 ${width} ${height}`}>
      {terms.map((term) =>
        <Term key={`${term.start}-${term.count}`} term={term} x={x} y={y} curMinMax={curMinMax}/>)}
    </svg>
  );
}

function Term({ term, x, y, curMinMax }: {
  term: Term,
  x: ScaleBand<number>,
  y: ScaleLinear<number, number>,
  curMinMax: [number, number],
}) {
  const start = x(term.start)!;
  const end = y(term.count);
  const isActive = term.start <= curMinMax[1] && term.end >= curMinMax[0];

  return (
    <TooltipTrigger delay={0} closeDelay={0}>
      <Focusable>
        <g className={cn(classes.barchartBar, isActive && classes.active)} role="button">
          <rect className={classes.background}
            x={Math.floor(start)} y={marginTop}
            width={Math.ceil(x.bandwidth())} height={height - marginTop - marginBottom}/>

          <rect className={classes.fill}
            x={Math.floor(start)} y={Math.round(end)}
            width={Math.ceil(x.bandwidth())} height={Math.round(height - end)}/>
        </g>
      </Focusable>

      <TermTooltip term={term} offset={50 - end}/>
    </TooltipTrigger>
  );
}

function TermTooltip({ term, offset }: { term: Term, offset: number }) {
  return (
    <Tooltip className={classes.tooltip} offset={offset}>
      <div className={classes.years}>{term.start} - {term.end}</div>
      {term.count} results
    </Tooltip>
  );
}
