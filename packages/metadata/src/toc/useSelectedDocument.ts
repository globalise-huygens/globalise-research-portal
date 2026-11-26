import { useMemo } from 'react';
import { useSelectedCanvas, useSelectedDocumentId } from '@globalise/common/document';
import { selectDocument } from './selectDocument.ts';
import { useToc } from './useToc.ts';
import type { ManifestDocument } from './toToc.ts';

export function useSelectedDocument(): ManifestDocument | undefined {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();
  const selectedDocumentId = useSelectedDocumentId();
  return useMemo(
    () => selectDocument(documents, selectedCanvasId, selectedDocumentId),
    [documents, selectedCanvasId, selectedDocumentId],
  );
}
