import { useMemo } from 'react';
import type { IdentifiedPanelModel } from './EntityPanelModel.ts';
import { toLinkedEntities } from './toLinkedEntities.ts';
import { useDocumentMetadata } from './useDocumentMetadata.ts';

export function useIdentifiedPanel(): IdentifiedPanelModel {
  const { document, documentMetadata } = useDocumentMetadata();

  const linkedEntities = useMemo(
    () => documentMetadata ? toLinkedEntities(documentMetadata) : [],
    [documentMetadata],
  );

  return { document, linkedEntities };
}
