import { HydraCollection } from './HydraModel.ts';

export type HydraState = {
  uri: string | null;
  collection: HydraCollection | null;
};

export const emptyHydraState: HydraState = {
  uri: null,
  collection: null,
};
