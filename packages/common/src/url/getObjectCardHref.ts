export function getObjectCardHref(uri: string): string {
  return `/object-card?uri=${encodeURIComponent(uri)}`;
}
