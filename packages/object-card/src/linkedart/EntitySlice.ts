import { LinkedArtNode } from '@globalise/common';
import { setState, useObjectCardStore } from '../ObjectCardStore.ts';
import { EntityState } from './EntityState.ts';

export type EntitySlice = {
  entityState: EntityState;
};

export function setEntity(uri: string, entity: LinkedArtNode) {
  setState({ entityState: { uri, entity } });
}

export function useEntity(): EntityState {
  return useObjectCardStore((s) => s.entityState);
}
