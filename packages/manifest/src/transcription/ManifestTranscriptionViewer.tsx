import { useEffect, useMemo, useState } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { useSettings } from '@globalise/document';
import { initCanvases } from '@globalise/common/document';
import { ManifestDiplomaticViewer } from './ManifestDiplomaticViewer.tsx';
import { ManifestLineByLineViewer } from './ManifestLineByLineViewer.tsx';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';

type Props = {
  initialCanvas?: number;
  onCanvasChange: (index: number) => void;
};

export function ManifestTranscriptionViewer(
  { initialCanvas = 0, onCanvasChange }: Props,
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

  useEffect(initCanvasesOnLoad, [canvasIds, initialCanvas]);
  function initCanvasesOnLoad() {
    if (canvasIds.length) {
      initCanvases(canvasIds, initialCanvas);
      setStoreReady(true);
    }
  }

  if (!storeReady) {
    return null;
  }

  if (transcriptionMode === 'line-by-line') {
    return (
      <ManifestLineByLineViewer
        initialCanvas={initialCanvas}
        onCanvasChange={onCanvasChange}
      />
    );
  }
  return (
    <ManifestDiplomaticViewer
      initialCanvas={initialCanvas}
      onCanvasChange={onCanvasChange}
    />
  );
}