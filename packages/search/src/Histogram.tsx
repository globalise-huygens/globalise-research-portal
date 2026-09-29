import { useRef, useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { Term } from './RangeFacet';
import classes from './Histogram.module.css';

const width = 300;
const height = 150;

const marginLeft = 0;
const marginRight = 0;
const marginTop = 16;
const marginBottom = 8;

type TooltipData = {
  x: number;
  y: number;
  term: Term | null;
};

type Selection = {
  start: number;
  end: number;
};

const isActive = (term: Term, selection: Selection) =>
  (term.start >= selection.start && term.start <= selection.end) ||
  (term.end >= selection.start && term.end <= selection.end);

export default function Histogram({ terms, selection }: { terms: Term[], selection: Selection }) {
  const [tooltipData, setTooltipData] = useState<TooltipData>({ x: 0, y: 0, term: null });

  return (
    <div className={classes.histogram}>
      <HistogramVisualization terms={terms} setTooltipData={setTooltipData} selection={selection}/>
      <Tooltip {...tooltipData}/>
    </div>
  );
}

function HistogramVisualization({ terms, setTooltipData, selection }: {
  terms: Term[],
  setTooltipData: (value: TooltipData | ((prev: TooltipData) => TooltipData)) => void,
  selection: Selection,
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const data_years = terms.map((item) => item.start);
  const data_amounts = terms.map((item) => item.count);
  const data = terms.map((item) => ({ x: item.start, y: item.count }));

  const x = scaleBand(data_years, [marginLeft, width - marginRight]).padding(0);
  const y = scaleLinear(extent(data_amounts) as [number, number], [height - marginBottom, marginTop]);

  return (
    <svg onMouseLeave={() => setTooltipData((tooltipData) => ({ ...tooltipData, term: null }))}
      viewBox={'0 0 ' + width.toString() + ' ' + height.toString()} ref={svgRef}>
      <g>
        {data.map((d) => (
          <g onMouseEnter={() => {
            const bounding = svgRef.current!.getBoundingClientRect();
            const tx = (x(d.x)!) + bounding.left;
            const ty = y(d.y) + bounding.top - 50;
            setTooltipData({
              x: tx,
              y: ty,
              term: terms[data_years.indexOf(d.x)],
            });
          }}
          className={classes.barchartBar + (isActive(terms[data_years.indexOf(d.x)], selection) ? (' ' + classes.active) : '')}
          key={`${d.x}-${d.y}`}>
            <rect className={classes.barchartBarBackground}
              x={Math.floor(x(d.x)!)} y={marginTop} width={Math.ceil(x.bandwidth())} height={height - marginTop}
              stroke={'none'} opacity={1}/>
            <rect className={classes.barchartBarFill} x={Math.floor(x(d.x)!)} y={Math.round(y(d.y))}
              width={Math.ceil(x.bandwidth())} height={Math.round(height - y(d.y))} strokeOpacity={0}/>
          </g>
        ))}
      </g>
    </svg>
  );
}

function Tooltip({ x, y, term }: TooltipData) {
  const startReadable = typeof term?.start == 'string' ? new Date(term?.start).toDateString() : term?.start;
  const endReadable = typeof term?.end == 'string' ? new Date(term?.end).toDateString() : term?.end;

  return (
    <div hidden={term === null} className={classes.tooltip} style={{ top: y, left: x }}>
      <strong>{startReadable} - {endReadable}</strong><br/>
      {term?.count} results
    </div>
  );
}
