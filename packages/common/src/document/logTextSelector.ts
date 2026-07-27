import { getCanvasAnnotationPages } from './ManifestViewerSlice.ts';
import { DocumentState, useDocumentStore } from './DocumentStore.ts';
import { findTextPositionSelector, getPageText, Id } from '../annotation';


let isLogged = false;

export function logTextSelector(annotationId: Id) {
  useDocumentStore.subscribe((state: DocumentState) => {
    if (isLogged) {
      return;
    }
    const canvasId = state.selectedCanvasId;
    if (!canvasId) {
      return;
    }
    const canvas = state.canvases[canvasId];
    if (!canvas) {
      return;
    }
    const annotations = canvas?.annotations;
    if (!annotations) {
      return;
    }
    const annotation = annotations[annotationId];
    const {
      error,
      hasAnnotations,
    } = getCanvasAnnotationPages(state, canvasId);

    if (error || !hasAnnotations) {
      return;
    }

    const { id: pageId, text } = getPageText(annotations);
    if (!text) {
      return;
    }
    const selector = findTextPositionSelector(annotation, pageId);
    if (!selector) {
      return;
    }
    const annoTextSlice = text.slice(selector.start, selector.end);

    isLogged = true;
    console.debug(logTextSelector.name, {
      canvasId,
      annotationId,
      pageId,
      selector,
      annoTextSlice,
    });
  });
}


