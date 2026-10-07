import { useMemo } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import type { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { findNormalizedTextLength, isEmbeddedAnnotationPage } from '../annotation';
import { getAnnotationPages } from './getAnnotationPages';
import { findCanvasAtCharOffset } from './findCanvasAtCharOffset.ts';
import type { DocumentHit } from './manifestPageUrl';
import type { CanvasId } from './ManifestViewerSlice';

/**
 * Find the canvas belonging to a search hit in a document:
 * - determine all document canvases
 * - measure the text length of each canvas
 * - pick the canvas where the summed length passes the hit's start char offset
 * - when start offset exceeds document text, use the start canvas
 */
export function useDocumentHitCanvasId(hit?: DocumentHit): CanvasId | undefined {
  const { vault, id: manifestId } = useManifest();
  const startCanvasId = hit?.startCanvasId;
  const endCanvasId = hit?.endCanvasId;
  const startCharOffset = hit?.startCharOffset ?? 0;

  return useMemo(() => {
    if (!manifestId || !startCanvasId || !endCanvasId) {
      return;
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    const canvases = vault.get<CanvasNormalized>(manifest.items);
    const start = canvases.findIndex((canvas) => canvas.id === startCanvasId);
    const end = canvases.findIndex((canvas) => canvas.id === endCanvasId);
    if (start === -1 || end < start) {
      return;
    }
    const lengths = canvases.slice(start, end + 1).map((canvas) => ({
      canvasId: canvas.id,
      length: findNormalizedTextLength(
        getAnnotationPages(vault, canvas)
          .filter(isEmbeddedAnnotationPage)
          .flatMap((page) => page.items),
      ),
    }));
    return findCanvasAtCharOffset(lengths, startCharOffset) ?? startCanvasId;
  }, [vault, manifestId, startCanvasId, endCanvasId, startCharOffset]);
}
