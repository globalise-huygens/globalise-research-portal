import { useEffect, useState } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { type CanvasId, initCanvases } from './ManifestViewerSlice';

export function useInitCanvases(canvasId?: CanvasId): boolean {
  const { vault, id: manifestId, isReady } = useManifest();
  const [initializedManifestId, setInitializedManifestId] = useState<string | null>(null);
  const isInitialized = isReady && initializedManifestId === manifestId;

  useEffect(initCanvasesOfManifest, [vault, manifestId, isReady, isInitialized, canvasId]);

  function initCanvasesOfManifest() {
    if (!isReady || !manifestId || isInitialized) {
      return;
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    initCanvases(manifest.items.map((item) => item.id), canvasId);
    setInitializedManifestId(manifestId);
  }

  return isInitialized;
}
