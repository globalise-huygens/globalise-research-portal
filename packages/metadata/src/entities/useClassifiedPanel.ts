import { useMemo } from 'react';
import type { NerCategoryGroup } from './EntityPanelModel.ts';
import { mapPanelData, type PanelData } from './PanelData.ts';
import { toNerCategoryGroups } from './toNerCategoryGroups.ts';
import { useDocumentMetadata } from './useDocumentMetadata.ts';
import { useNerCategoryTotals } from './useNerCategoryTotals.ts';

export function useClassifiedPanel(): PanelData<NerCategoryGroup[]> {
  const documentMetadata = useDocumentMetadata();
  const nerCategoryTotals = useNerCategoryTotals(documentMetadata);

  return useMemo(
    () => mapPanelData(nerCategoryTotals, toNerCategoryGroups),
    [nerCategoryTotals],
  );
}
