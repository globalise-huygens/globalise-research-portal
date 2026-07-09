import { LinkedArtNode } from '../linkedart';

export type MetadataState = {
  url: string | null;
  root: LinkedArtNode | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type ManifestMetadataSlice = {
  metadata: MetadataState;
};

export const emptyMetadataState: MetadataState = {
  url: null,
  root: null,
  isLoading: false,
  isReady: false,
  error: null,
};

export const defaultManifestMetadataSlice: ManifestMetadataSlice = {
  metadata: emptyMetadataState,
};