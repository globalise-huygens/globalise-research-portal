import { emptyLoadState, UriLoadState } from './LoadState.ts';

export type CardKind = 'skos' | 'entity';

export type CardState = UriLoadState & {
  kind: CardKind | null;
};

export const emptyCardState: CardState = {
  ...emptyLoadState,
  uri: null,
  kind: null,
};
