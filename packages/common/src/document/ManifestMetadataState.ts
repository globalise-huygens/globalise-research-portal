import { LinkedArtNode } from '../linkedart';

export type MetadataState = {
  root: LinkedArtNode | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export const emptyMetadataState: MetadataState = {
  root: null,
  isLoading: false,
  isReady: false,
  error: null,
};
