import { DateRange } from './DateRange.tsx';
import { isSameDay } from './isSameDay.ts';

export type TimespanProps = {
  beginOfTheBegin?: string;
  endOfTheBegin?: string;
  beginOfTheEnd?: string;
  endOfTheEnd?: string;
};

export function Timespan(
  { beginOfTheBegin, endOfTheBegin, beginOfTheEnd, endOfTheEnd }: TimespanProps,
) {
  const isFuzzy = (!!endOfTheBegin && !isSameDay(beginOfTheBegin, endOfTheBegin))
    || (!!beginOfTheEnd && !isSameDay(beginOfTheEnd, endOfTheEnd));
  if (!isFuzzy) {
    return <DateRange begin={beginOfTheBegin} end={endOfTheEnd}/>;
  }
  return (
    <>
      <div>Start: <DateRange begin={beginOfTheBegin} end={endOfTheBegin}/></div>
      <div>End: <DateRange begin={beginOfTheEnd} end={endOfTheEnd}/></div>
    </>
  );
}
