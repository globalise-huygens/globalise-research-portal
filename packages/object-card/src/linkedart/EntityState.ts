import { LinkedArtNode } from '@globalise/common';

export type EntityState = {
  uri: string | null;
  entity: LinkedArtNode | null;
};

export const emptyEntityState: EntityState = {
  uri: null,
  entity: null,
};
