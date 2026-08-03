import {
  type Annotation,
  type EntityClassificationId,
  hasEntityClassification,
} from '../annotation';
import { setState, useDocumentStore } from './DocumentStore';

export type EntityHighlightSlice = {
  entityHighlightClassifications: Set<EntityClassificationId>;
};

export function setEntityHighlightClassifications(
  classifications: ReadonlySet<EntityClassificationId>,
) {
  setState({ entityHighlightClassifications: new Set(classifications) });
}

export function useEntityHighlightClassifications() {
  return useDocumentStore((s) => s.entityHighlightClassifications);
}

export function useIsEntityHighlightVisible(annotation: Annotation) {
  return useDocumentStore((state) =>
    hasEntityClassification(
      annotation,
      state.entityHighlightClassifications,
    ),
  );
}
