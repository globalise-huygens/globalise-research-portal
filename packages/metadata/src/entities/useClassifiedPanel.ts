import { useMemo } from 'react';
import type { ClassifiedPanelModel } from './EntityPanelModel.ts';
import { toNerCategoryGroups } from './toNerCategoryGroups.ts';
import { useDocumentMetadata } from './useDocumentMetadata.ts';
import { useNerCategoryTotals } from './useNerCategoryTotals.ts';

export function useClassifiedPanel(): ClassifiedPanelModel {
  const { document, documentMetadata } = useDocumentMetadata();
  const nerCategoryTotals = useNerCategoryTotals(documentMetadata);

  const nerCategoryGroups = useMemo(
    () => toNerCategoryGroups(nerCategoryTotals),
    [nerCategoryTotals],
  );

  return { document, nerCategoryGroups };
}
