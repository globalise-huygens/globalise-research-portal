import { type Timespan } from '@globalise/common';
import { formatTimespan, formatTimespanBoundaries, formatTimespanSummary } from './TimespanFormat.ts';

type TimespanValueProps = {
  timespan: Timespan | null;
  mode?: 'range' | 'event' | 'boundaries' | 'summary';
};

export function TimespanValue({ timespan, mode = 'range' }: TimespanValueProps) {
  if (!timespan) {
    return null;
  }
  const lines = mode === 'boundaries' ? formatTimespanBoundaries(timespan)
    : mode === 'summary' ? formatTimespanSummary(timespan) : formatTimespan(timespan, mode === 'event');
  if (lines.length === 1) {
    return <>{lines[0]}</>;
  }
  return (
    <span className="timespan-boundaries">
      {lines.map((line) => <span key={line}>{line}</span>)}
    </span>
  );
}
