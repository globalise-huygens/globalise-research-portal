export type TimespanProps = {
  begin?: string;
  end?: string;
};

export function Timespan({ begin, end }: TimespanProps) {
  return (
    <>
      <span title={begin}>{formatDate(begin)}</span>
      &nbsp;&ndash;&nbsp;
      <span title={end}>{formatDate(end)}</span>
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