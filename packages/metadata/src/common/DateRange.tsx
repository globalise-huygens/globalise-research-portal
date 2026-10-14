import { isSameDay } from './isSameDay.ts';

export type DateRangeProps = {
  begin?: string;
  end?: string;
};

export function DateRange({ begin, end }: DateRangeProps) {
  if (isSameDay(begin, end)) {
    return <time dateTime={begin}>{formatDate(begin)}</time>;
  }
  return (
    <>
      <time dateTime={begin} title={begin}>{formatDate(begin)}</time>
      &nbsp;&ndash;&nbsp;
      <time dateTime={end} title={end}>{formatDate(end)}</time>
    </>
  );
}

function formatDate(value?: string): string {
  if (!value) {
    return '?';
  }
  if (/^\d{4}$/.test(value)) {
    return value;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    day: /^\d{4}-\d{2}$/.test(value) ? undefined : 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
