export type UriSearch = {
  uri?: string;
};

export function uriSearch(search: Record<string, unknown>): UriSearch {
  return { uri: typeof search.uri === 'string' ? search.uri : undefined };
}
