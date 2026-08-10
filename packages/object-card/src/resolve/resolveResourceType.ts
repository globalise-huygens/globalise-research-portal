import { isLinkedArtNode } from '@globalise/common';
import { isHydraCollection } from '../hydra';
import { isSkosConcept } from '../skos';
import { ResourceType } from './ResourceState.ts';

export function resolveResourceType(payload: unknown): ResourceType | null {
  if (isHydraCollection(payload)) {
    return 'hydra';
  }
  if (isSkosConcept(payload)) {
    return 'skos';
  }
  if (isLinkedArtNode(payload)) {
    return 'entity';
  }
  return null;
}
