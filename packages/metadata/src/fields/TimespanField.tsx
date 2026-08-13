import { getTimespan, useMetadataNodes } from '@globalise/common';
import { EmptyPair, Pair, Timespan } from '../common';
import type { FieldProps } from './FieldProps';

export function TimespanField({
  url,
  label = 'Timespan',
  fallback,
  path = ['produced_by', 'timespan'],
}: FieldProps) {
  const [timespan] = useMetadataNodes(url, path).map(getTimespan);
  if (!timespan) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Timespan {...timespan}/>
    </Pair>
  );
}