import { useEffect, useMemo } from 'react';
import { loadMetadata, useMetadataRoot } from '@globalise/common';
import { useDocumentStore } from '@globalise/common/document';
import { useCurrentDocument } from '../toc';
import type { EntityPanelModel } from './EntityPanelModel.ts';
import { toLinkedEntities } from './toLinkedEntities.ts';
import { toNerCategoryGroups } from './toNerCategoryGroups.ts';

/**
 * Entities of the current document: linked entities from its record,
 * NER categories from the entity annotations of its loaded canvases.
 */
export function useEntityPanel(): EntityPanelModel {
  const document = useCurrentDocument();
  const metadataUrl = document?.metadataUrl;
  const record = useMetadataRoot(metadataUrl);
  const canvases = useDocumentStore((s) => s.canvases);

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
    () => toNerCategoryGroups((document?.scans ?? []).map(({ canvasId }) => ({
      canvasId,
      annotations: Object.values(canvases[canvasId]?.annotations ?? {}),
    }))),
    [document, canvases],
  );

  return { document, linkedEntities, nerCategoryGroups };
}
