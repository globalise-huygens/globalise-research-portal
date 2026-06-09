import {CanvasId, useAnnotations, usePages} from '@globalise/common/document';
import {LineByLineView} from '@globalise/line-by-line';
import {Minimap} from './Minimap';
import {useZoomToClicked} from './useZoomToClicked';

import './MinimapView.css';
import {Id} from "@globalise/common/annotation";

export function MinimapView({canvasId}: {canvasId: CanvasId}) {
  const annotations = useAnnotations(canvasId);
  const {isReady, hasAnnotations, error} = usePages(canvasId);

  useZoomToClicked(canvasId);

  if (error) {
    return <div className="message error">Error: {error}</div>;
  }
  if (!isReady) {
    return <div className="message">Loading...</div>;
  }
  if (!hasAnnotations) {
    return <div className="message">No transcription</div>;
  }
  if (!annotations) {
    return <div className="message">Loading...</div>;
  }

  return (
    <div className="minimap-view">
      <LineByLineView annotations={annotations}/>
      <Minimap canvasId={canvasId} />
    </div>
  );
}