import { useEffect, useMemo, useState } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { useSettings } from '@globalise/document';
import { initCanvases, useDocumentStore } from '@globalise/common/document';
import { ManifestDiplomaticViewer } from './ManifestDiplomaticViewer.tsx';
import { ManifestLineByLineViewer } from './ManifestLineByLineViewer.tsx';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';

type Props = {
  initialCanvasId?: string;
  onCanvasChange: (canvasId: string) => void;
};

export function ManifestTranscriptionViewer(
  { initialCanvasId, onCanvasChange }: Props,
) {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();
  const { transcriptionMode } = useSettings();
  const [storeReady, setStoreReady] = useState(false);

  const canvasIds = useMemo(() => {
    if (!manifestId || !isManifestReady) {
      return [];
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    return manifest.items.map((item) => vault.get<CanvasNormalized>(item).id);
  }, [vault, manifestId, isManifestReady]);

  useEffect(initCanvasesOnLoad, [canvasIds, initialCanvasId]);
  function initCanvasesOnLoad() {
    if (canvasIds.length) {
      initCanvases(canvasIds, initialCanvasId);
      setStoreReady(true);
    }
  }

  if (!storeReady) {
    return null;
  }

  const currentCanvasId = useDocumentStore.getState().selectedCanvasId ?? undefined;

  if (transcriptionMode === 'line-by-line') {
    return (
      <ManifestLineByLineViewer
        initialCanvasId={currentCanvasId}
        onCanvasChange={onCanvasChange}
      />
    );
  }
  return (
    <ManifestDiplomaticViewer
      initialCanvasId={currentCanvasId}
      onCanvasChange={onCanvasChange}
    />
  );
}