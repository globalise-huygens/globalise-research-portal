import type { EntityClassificationId } from '../annotation';
import { setState, useDocumentStore } from './DocumentStore';

export type EntityHighlightSlice = {
  entityHighlightClassifications: Set<EntityClassificationId>;
};

export function setEntityHighlightClassifications(
  classifications: Set<EntityClassificationId>,
) {
  setState({ entityHighlightClassifications: new Set(classifications) });
}

export function useEntityHighlightClassifications() {
  return useDocumentStore((s) => s.entityHighlightClassifications);
}

export function useIsEntityHighlightClassificationVisible(
  classificationId?: EntityClassificationId,
) {
  return useDocumentStore((s) =>
    classificationId !== undefined &&
    s.entityHighlightClassifications.has(classificationId),
  );
}
