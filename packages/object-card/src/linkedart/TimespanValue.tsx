import { Timespan } from '@globalise/common';

type TimespanValueProps = {
  timespan: Timespan | null;
};

export function TimespanValue({ timespan }: TimespanValueProps) {
  if (!timespan) {
    return null;
  }
  const uncertainBoundaries = formatUncertainTimespan(timespan);
  if (uncertainBoundaries.length) {
    return (
      <span className="timespan-boundaries">
        {uncertainBoundaries.map((boundary) => (
          <span key={boundary}>{boundary}</span>
        ))}
      </span>
    );
  }
  if (timespan.label) {
    return <>{formatDate(timespan.label)}</>;
  }
  const dates = [timespan.beginOfTheBegin, timespan.endOfTheEnd]
    .filter((date): date is string => !!date)
    .map(formatDate);
  return <>{dates.join(' – ')}</>;
}

function formatUncertainTimespan(timespan: Timespan): string[] {
  if (!timespan.endOfTheBegin && !timespan.beginOfTheEnd) {
    return [];
  }
  const start = formatBoundary(
    'Start',
    timespan.beginOfTheBegin,
    timespan.endOfTheBegin,
  );
  const end = formatBoundary(
    'End',
    timespan.beginOfTheEnd,
    timespan.endOfTheEnd,
  );
  return [start ?? 'Start: not recorded', end ?? 'End: not recorded'];
}

function formatBoundary(
  label: string,
  earliest?: string,
  latest?: string,
): string | undefined {
  const dates = [earliest, latest]
    .filter((date): date is string => !!date)
    .map(formatDate);
  if (!dates.length) {
    return undefined;
  }
  if (dates.length === 1 || dates[0] === dates[1]) {
    return `${label}: ${dates[0]}`;
  }
  return `${label}: between ${dates[0]} and ${dates[1]}`;
}

function formatDate(value: string): string {
  return value.replace(
    /T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g,
    '',
  );
}
