import {useEffect} from 'react';
import {useManifest} from '@knaw-huc/osd-iiif-viewer';
import {
  useSelectedCanvas,
  useLoadCanvas,
} from '@globalise/common/document';
import {LazyCollectionViewer} from "./LazyCollectionViewer.tsx";
import {CollectionFacsimileOverlay} from "./CollectionFacsimileOverlay.tsx";
import {getAnnotationPageUrls} from "../getAnnotationPageUrls.ts";

type Props = {
  initialCanvas: number
  onCanvasChange: (index: number) => void
}

export function ManifestFacsimileViewer(
  {initialCanvas, onCanvasChange}: Props
) {
  const {isReady: isManifestReady, vault} = useManifest();
  const {isInit: isCanvasInit, isReady: isCanvasReady, id: canvasId} = useSelectedCanvas();
  const loadPages = useLoadCanvas();

  useEffect(loadAnnotationPages, [vault, isCanvasReady, canvasId, loadPages]);
  function loadAnnotationPages() {
    if (!vault || !isManifestReady || !canvasId) {
      return;
    }
    const canvas = vault.get({id: canvasId, type: 'Canvas'});
    const urls = getAnnotationPageUrls(canvas);
    if (urls.length) {
      loadPages(canvasId, urls);
    }
  }

  return <LazyCollectionViewer
    scanHeight={0.25}
    initialCanvas={initialCanvas}
    onCanvasChange={onCanvasChange}
  >
    {isCanvasInit && <CollectionFacsimileOverlay canvasId={canvasId}/>}
  </LazyCollectionViewer>;
}