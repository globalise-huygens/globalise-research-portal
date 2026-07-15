import { useMetadataValues } from '@globalise/common';
import { Pair, Timespan } from '../common';

export function TimespanField() {
  const label = 'Timespan';
  const begin = useMetadataValues(['produced_by', 'timespan', 'begin_of_the_begin'])[0];
  const end = useMetadataValues(['produced_by', 'timespan', 'end_of_the_end'])[0];
  if (!begin && !end) {
    return null;
  }
  return (
    <Pair label={label}>
      <Timespan begin={begin} end={end}/>
    </Pair>
  );
}
