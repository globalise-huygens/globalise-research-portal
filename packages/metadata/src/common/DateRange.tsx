export type DateRangeProps = {
  begin?: string;
  end?: string;
};

export function DateRange({ begin, end }: DateRangeProps) {
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
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}