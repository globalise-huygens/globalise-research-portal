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