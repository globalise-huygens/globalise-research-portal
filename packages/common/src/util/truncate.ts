export function truncate(
  text: string,
  start: number,
  end: number,
  omission = '[..]',
): string {
  const head = start > 0
    ? `${omission} `
    : '';
  const tail = end < text.length
    ? ` ${omission}`
    : '';
  return `${head}${text.slice(start, end)}${tail}`;
}
