import { type Timespan } from '@globalise/common';
import { formatTimespan, formatTimespanBoundaries } from './TimespanFormat.ts';

type TimespanValueProps = {
  timespan: Timespan | null;
  event?: boolean;
  boundaries?: boolean;
};

export function TimespanValue({ timespan, event = false, boundaries = false }: TimespanValueProps) {
  if (!timespan) {
    return null;
  }
  const lines = boundaries ? formatTimespanBoundaries(timespan) : formatTimespan(timespan, event);
  if (lines.length === 1) {
    return <>{lines[0]}</>;
  }
  return (
    <span className="timespan-boundaries">
      {lines.map((line) => <span key={line}>{line}</span>)}
    </span>
  );
}
