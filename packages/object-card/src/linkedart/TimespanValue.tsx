import { Timespan } from '@globalise/common';

type TimespanValueProps = {
  timespan: Timespan | null;
};

export function TimespanValue({ timespan }: TimespanValueProps) {
  if (!timespan) {
    return null;
  }
  if (timespan.label) {
    return <>{timespan.label}</>;
  }
  const dates = [timespan.beginOfTheBegin, timespan.endOfTheEnd]
    .filter((date) => !!date);
  return <>{dates.join(' – ')}</>;
}
