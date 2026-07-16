import { useMetadataValues } from '@globalise/common';
import { EmptyPair, Pair, Timespan } from '../common';
import type { FieldProps } from './FieldProps';

const timespanPath = ['produced_by', 'timespan'];

export function TimespanField({ url, label = 'Timespan', fallback }: FieldProps) {
  const beginOfTheBegin = useMetadataValues(url, [...timespanPath, 'begin_of_the_begin'])[0];
  const endOfTheBegin = useMetadataValues(url, [...timespanPath, 'end_of_the_begin'])[0];
  const beginOfTheEnd = useMetadataValues(url, [...timespanPath, 'begin_of_the_end'])[0];
  const endOfTheEnd = useMetadataValues(url, [...timespanPath, 'end_of_the_end'])[0];
  if (!beginOfTheBegin && !endOfTheBegin && !beginOfTheEnd && !endOfTheEnd) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Timespan
        beginOfTheBegin={beginOfTheBegin}
        endOfTheBegin={endOfTheBegin}
        beginOfTheEnd={beginOfTheEnd}
        endOfTheEnd={endOfTheEnd}
      />
    </Pair>
  );
}