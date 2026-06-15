import { useEffect, useRef } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { Id } from '@globalise/common/annotation';
import {
  initCanvases,
  useSelectedCanvas,
} from '@globalise/common/document';
import { useCanvasPages } from './useCanvasPages.tsx';

export type DocumentLifecycle =
  | { phase: 'loading-manifest' }
  | { phase: 'manifest-ready'; canvasId: string }
  | { phase: 'annotations-ready'; canvasId: string };

export function useDocumentLifecycle(
  manifestUrl: string,
  requestedCanvasId: string | undefined,
  onPageChange: (id: Id) => void,
): DocumentLifecycle {
  const { isReady: isManifestReady, vault } = useManifest();
  const isPageInit = useCanvasPages(requestedCanvasId, onPageChange);
  const { isInit: isCanvasInit, isReady: isCanvasReady, id: canvasId } = useSelectedCanvas();

  const seededRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isManifestReady) {
      return;
    }
    if (seededRef.current === manifestUrl) {
      return;
    }
    const manifest = vault.get({ id: manifestUrl, type: 'Manifest' });
    if (!manifest) {
      return;
    }
    initCanvases(manifest.items.map((i) => i.id));
    seededRef.current = manifestUrl;
  }, [isManifestReady, manifestUrl, vault]);

  if (!isManifestReady || !isPageInit || !requestedCanvasId) {
    return { phase: 'loading-manifest' };
  }
  if (!isCanvasInit || !isCanvasReady) {
    return { phase: 'manifest-ready', canvasId: requestedCanvasId };
  }
  return { phase: 'annotations-ready', canvasId };
}