import { setState, useObjectCardStore } from '../ObjectCardStore.ts';
import { HydraCollection } from './HydraModel.ts';
import { HydraState } from './HydraState.ts';

export type HydraSlice = {
  hydraState: HydraState;
};

export function setCollection(uri: string, collection: HydraCollection) {
  setState({ hydraState: { uri, collection } });
}

export function useCollection(): HydraState {
  return useObjectCardStore((s) => s.hydraState);
}
