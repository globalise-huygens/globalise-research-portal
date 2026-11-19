/** Compare recorded ISO calendar dates, ignoring the time of day. */
export function isSameDay(a?: string, b?: string): boolean {
  return !!a && !!b && a.split('T')[0] === b.split('T')[0];
}
