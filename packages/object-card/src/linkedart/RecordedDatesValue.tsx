import type { RecordedDates } from '@globalise/common';

export function RecordedDatesValue({ dates }: { dates: RecordedDates }) {
  return (
    <span className="person-status-summary-date timespan-boundaries">
      {!!dates.starts.length && (
        <span>Recorded starts: {dates.starts.join(', ')}</span>
      )}
      {!!dates.ends.length && (
        <span>Recorded ends: {dates.ends.join(', ')}</span>
      )}
      {!!dates.dates.length && <span>Recorded dates: {dates.dates.join(', ')}</span>}
    </span>
  );
}
