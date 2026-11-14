import { useMemo } from 'react';
import type { LinkedEntity } from './EntityPanelModel.ts';
import { mapPanelData, type PanelData } from './PanelData.ts';
import { toLinkedEntities } from './toLinkedEntities.ts';
import { useDocumentMetadata } from './useDocumentMetadata.ts';

export function useIdentifiedPanel(): PanelData<LinkedEntity[]> {
  const documentMetadata = useDocumentMetadata();

  return useMemo(
    () => mapPanelData(documentMetadata, toLinkedEntities),
    [documentMetadata],
  );
}
