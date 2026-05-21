import {useEffect} from 'react';
import {useViewer} from '@knaw-huc/osd-iiif-viewer';
import {
  useAnnotations,
  useDocumentStore, usePartOf, CanvasId,
} from '@globalise/common/document';
import {
  isWord,
  findSvgPath,
  parseSvgPath,
  Id,
  Annotation
} from '@globalise/common/annotation';
import {calcBoundingBox, createPoints} from '@knaw-huc/original-layout';
import { orThrow } from '@globalise/common';

export function useZoomToClicked(canvasId: CanvasId) {
  const pageSize = usePartOf(canvasId);
  const viewer = useViewer();
  const annotations = useAnnotations(canvasId);
  const {wordToLine, entityToWords} = useDocumentStore(s => s.indexes);
  const clickedId = useDocumentStore(s => s.clickedId);

  useEffect(() => {
    if (!clickedId || !annotations || !viewer) {
      return;
    }

    const ids = findSelectedWords(clickedId, annotations, entityToWords);
    if (!ids.length) {
      console.log('Could not resolve to words', clickedId);
      return;
    }

    const allPoints = ids.flatMap(id => {
      const svgPath = findSvgPath(annotations[id]) ?? orThrow('No svg path');
      return createPoints(parseSvgPath(svgPath),);
    });
    const bbox = calcBoundingBox(allPoints);
    const padding = pageSize ? pageSize.width * 0.05 : 100;
    const zoomViewport = viewer.viewport.imageToViewportRectangle(
      bbox.left - padding,
      bbox.top - padding,
      bbox.width + padding * 2,
      bbox.height + padding * 2,
    );
    viewer.viewport.fitBounds(zoomViewport);
    }, [clickedId, annotations, viewer, wordToLine, entityToWords, pageSize]
  );
}

function findSelectedWords(
  clicked: Id,
  annotations: Record<Id, Annotation>,
  entityToWords: Record<Id, Id[]>
): Id[] {
  const annotation = annotations[clicked];
  if (!annotation) {
    return [];
  }
  if (isWord(annotation)) {
    return [clicked];
  }
  return entityToWords[clicked] ?? [];
}