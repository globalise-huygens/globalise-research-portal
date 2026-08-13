import { emptyLoadState, UriLoadState } from './LoadState.ts';

export type CardType = 'skos' | 'entity';

export type CardState = UriLoadState & {
  type: CardType | null;
};

export const emptyCardState: CardState = {
  ...emptyLoadState,
  uri: null,
  type: null,
};
