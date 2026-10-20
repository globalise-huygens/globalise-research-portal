import { useEffect, useMemo } from 'react';
import { loadMetadata, useMetadataRoot } from '@globalise/common';
import { useCurrentDocument } from '../toc';
import type { EntityPanelModel } from './EntityPanelModel.ts';
import { toLinkedEntities } from './toLinkedEntities.ts';
import { toNerCategoryGroups } from './toNerCategoryGroups.ts';
import { useNerCategoryTotals } from './useNerCategoryTotals.ts';

/**
 * Entities of the current document: linked entities from its record,
 * NER category totals from the annotations set its record refers to.
 */
export function useEntityPanel(): EntityPanelModel {
  const document = useCurrentDocument();
  const metadataUrl = document?.metadataUrl;
  const record = useMetadataRoot(metadataUrl);
  const nerCategoryTotals = useNerCategoryTotals(record);

  useEffect(loadDocumentRecord, [metadataUrl]);

  function loadDocumentRecord() {
    if (metadataUrl) {
      loadMetadata(metadataUrl)
        .catch(console.error);
    }
  }

  const linkedEntities = useMemo(
    () => record ? toLinkedEntities(record) : [],
    [record],
  );

  const nerCategoryGroups = useMemo(
    () => toNerCategoryGroups(nerCategoryTotals),
    [nerCategoryTotals],
  );

  return { document, linkedEntities, nerCategoryGroups };
}
