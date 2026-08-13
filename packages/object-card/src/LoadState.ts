export type LoadState = {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type UriLoadState = LoadState & {
  uri: string | null;
};

export const emptyLoadState: LoadState = {
  isLoading: false,
  isReady: false,
  error: null,
};

/**
 * Has this uri already been fetched, or is it on its way?
 */
export function isRequested(state: UriLoadState, uri: string): boolean {
  return (
    state.uri === uri
    && (state.isLoading || state.isReady || !!state.error)
  );
}

export function getErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Unknown error';
}
