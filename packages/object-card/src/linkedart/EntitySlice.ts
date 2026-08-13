import { LinkedArtNode } from '@globalise/common';
import { setObjectCardState, useObjectCardStore } from '../ObjectCardStore.ts';
import { EntityState } from './EntityState.ts';

export type EntitySlice = {
  entityState: EntityState;
};

export function setEntity(uri: string, entity: LinkedArtNode) {
  setObjectCardState({ entityState: { uri, entity } });
}

export function useEntity(): EntityState {
  return useObjectCardStore((s) => s.entityState);
}
