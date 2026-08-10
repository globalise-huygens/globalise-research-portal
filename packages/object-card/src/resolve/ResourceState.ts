export type ResourceType = 'skos' | 'entity' | 'hydra';

export type ResourceState = {
  uri: string | null;
  type: ResourceType | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export const emptyResourceState: ResourceState = {
  uri: null,
  type: null,
  isLoading: false,
  isReady: false,
  error: null,
};
