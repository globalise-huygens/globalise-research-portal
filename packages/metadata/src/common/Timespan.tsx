import { DateRange } from './DateRange.tsx';

export type TimespanProps = {
  beginOfTheBegin?: string;
  endOfTheBegin?: string;
  beginOfTheEnd?: string;
  endOfTheEnd?: string;
};

/**
 * A timespan starts somewhere in a date range and ends in another one.
 * When both inner boundaries are missing, begin and end are certain enough
 * to render as a single date range.
 */
export function Timespan(
  { beginOfTheBegin, endOfTheBegin, beginOfTheEnd, endOfTheEnd }: TimespanProps,
) {
  const isFuzzy = !!endOfTheBegin || !!beginOfTheEnd;
  if (!isFuzzy) {
    return <DateRange begin={beginOfTheBegin} end={endOfTheEnd}/>;
  }
  return (
    <>
      <DateRange begin={beginOfTheBegin} end={endOfTheBegin}/>
      {' to '}
      <DateRange begin={beginOfTheEnd} end={endOfTheEnd}/>
    </>
  );
}