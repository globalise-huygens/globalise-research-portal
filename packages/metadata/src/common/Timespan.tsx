import { DateRange } from './DateRange.tsx';

export type TimespanProps = {
  beginOfTheBegin?: string;
  endOfTheBegin?: string;
  beginOfTheEnd?: string;
  endOfTheEnd?: string;
};

export function Timespan(
  { beginOfTheBegin, endOfTheBegin, beginOfTheEnd, endOfTheEnd }: TimespanProps,
) {
  const isFuzzy = (!!endOfTheBegin && beginOfTheBegin?.split('T')[0] !== endOfTheBegin.split('T')[0])
    || (!!beginOfTheEnd && endOfTheEnd?.split('T')[0] !== beginOfTheEnd.split('T')[0]);
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
