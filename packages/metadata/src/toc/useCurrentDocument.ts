import { useMemo } from 'react';
import { useSelectedCanvas } from '@globalise/common/document';
import { useToc } from './useToc.ts';
import type { ManifestDocument } from './toToc.ts';

export function useCurrentDocument(): ManifestDocument | undefined {
  const documents = useToc();
  const { id: selectedCanvasId } = useSelectedCanvas();
  return useMemo(
    () => documents.find(
      (document) => document.scans.some(
        (scan) => scan.canvasId === selectedCanvasId,
      ),
    ),
    [documents, selectedCanvasId],
  );
}
