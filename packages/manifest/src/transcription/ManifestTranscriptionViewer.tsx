import {
  copySelectedTranscriptionLines,
  initCanvases,
  useDocumentStore,
  useIsLayoutElementsVisible, useTranscriptionMode,
} from '@globalise/common/document';
import { FloatingToolbar } from '@globalise/design';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { useEffect, useMemo, useState } from 'react';
import { ManifestDiplomaticViewer } from './ManifestDiplomaticViewer.tsx';
import { ManifestLineByLineViewer } from './ManifestLineByLineViewer.tsx';
import { ManifestTranscriptionControls } from './ManifestTranscriptionControls.tsx';
import './ManifestTranscriptionViewer.css';

type Props = {
  initialCanvasId?: string;
  onCanvasChange: (canvasId: string) => void;
};

export function ManifestTranscriptionViewer({
  initialCanvasId,
  onCanvasChange,
}: Props) {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();
  const transcriptionMode = useTranscriptionMode();
  const showLayoutElements = useIsLayoutElementsVisible();
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

  const currentCanvasId =
    useDocumentStore.getState().selectedCanvasId ?? undefined;

  const content =
    transcriptionMode === 'line-by-line' ? (
      <ManifestLineByLineViewer
        initialCanvasId={currentCanvasId}
        showLayoutElements={showLayoutElements}
        onCanvasChange={onCanvasChange}
      />
    ) : (
      <ManifestDiplomaticViewer
        initialCanvasId={currentCanvasId}
        showLayoutElements={showLayoutElements}
        onCanvasChange={onCanvasChange}
      />
    );

  return (
    <div
      className="transcription-viewer"
      onCopy={(event) => {
        if (showLayoutElements) {
          copySelectedTranscriptionLines(event, event.currentTarget);
        }
      }}
    >
      <FloatingToolbar aria-label="Transcription controls">
        <ManifestTranscriptionControls />
      </FloatingToolbar>
      {content}
    </div>
  );
}
