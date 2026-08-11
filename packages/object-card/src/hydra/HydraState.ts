import { emptyLoadState, UriLoadState } from '../LoadState.ts';
import { HydraCollection } from './HydraModel.ts';

export type HydraState = UriLoadState & {
  collection: HydraCollection | null;
};

export const emptyHydraState: HydraState = {
  ...emptyLoadState,
  uri: null,
  collection: null,
};
