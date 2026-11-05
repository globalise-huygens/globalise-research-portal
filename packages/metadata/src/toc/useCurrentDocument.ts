import { useMemo } from 'react';
import { useSelectedCanvas } from '@globalise/common/document';
import { findCurrentDocument } from './tocEntries.ts';
import { useToc } from './useToc.ts';
import type { ManifestDocument } from './toToc.ts';

export function useCurrentDocument(preferredDocumentId?: string): ManifestDocument | undefined {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();
  return useMemo(
    () => findCurrentDocument(documents, selectedCanvasId, preferredDocumentId),
    [documents, selectedCanvasId, preferredDocumentId],
  );
}
