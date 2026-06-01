import {useEffect} from 'react';
import {useManifest} from '@knaw-huc/osd-iiif-viewer';
import {
  useSelectedCanvasStatus,
  useLoadCanvas,
  useSelectedCanvasId,
} from '@globalise/common/document';
import {LazyCollectionViewer} from "./LazyCollectionViewer.tsx";
import {ManifestFacsimileControls} from "./ManifestFacsimileControls.tsx";
import {CollectionFacsimileOverlay} from "./CollectionFacsimileOverlay.tsx";
import {getAnnotationPageUrls} from "../getAnnotationPageUrls.ts";

type Props = {
  initialCanvas: number
  onCanvasChange: (index: number) => void
}

export function ManifestFacsimileViewer(
  {initialCanvas, onCanvasChange}: Props
) {
  const {vault, isReady} = useManifest();
  const loadPages = useLoadCanvas();
  const canvasId = useSelectedCanvasId();

  useEffect(loadAnnotationPages, [vault, isReady, canvasId, loadPages]);
  function loadAnnotationPages() {
    if (!vault || !isReady || !canvasId) {
      return;
    }
    const canvas = vault.get({id: canvasId, type: 'Canvas'});
    const urls = getAnnotationPageUrls(canvas);
    if (urls.length) {
      loadPages(canvasId, urls);
    }
  }

  const canvasStatus = useSelectedCanvasStatus();

  return <LazyCollectionViewer
    scanHeight={0.25}
    initialCanvas={initialCanvas}
    onCanvasChange={onCanvasChange}
  >
    <ManifestFacsimileControls/>
    {canvasStatus.isReady
      ? <CollectionFacsimileOverlay canvasId={canvasStatus.canvasId}/>
      : <>Loading</>
    }
  </LazyCollectionViewer>;
}