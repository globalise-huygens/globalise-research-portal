import {FacsimileView} from '@globalise/facsimile';
import {Id} from '@globalise/common/annotation';
import {DocumentModeControls} from './DocumentModeControls';
import {SplitPaneLayout} from './layout/SplitPaneLayout';
import {TranscriptionView} from './TranscriptionView';
import {SinglePaneLayout} from './layout/SinglePaneLayout';
import {useCanvasPages} from './useCanvasPages';

import './DocumentView.css';
import {HeaderCanvasControls} from "./HeaderCanvasControls";
import {MinimapView} from "./minimap/MinimapView";
import {useSettings} from "./SettingsStore";
import {useCanvas} from "@knaw-huc/osd-iiif-viewer";

type DocumentViewProps = {
  manifestUrl: string;
  canvasId?: string;
  onPageChange: (id: Id) => void;
};

export function DocumentView(
  {canvasId, onPageChange}: DocumentViewProps
) {
  const {documentMode: mode} = useSettings()
  const isPageInit = useCanvasPages(canvasId, onPageChange);
  const {current} = useCanvas()

  if (!isPageInit || !canvasId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="document-view" style={{height: '100%'}}>
      <HeaderCanvasControls />
      <DocumentModeControls />
      {current && mode === 'split' && (
        <SplitPaneLayout>
          <FacsimileView
            canvasId={canvasId}
            showNavigation={false}
            style={{height: '100%'}}
          />
          <TranscriptionView canvasId={current.id}/>
        </SplitPaneLayout>
      )}
      {mode === 'facsimile' && (
        <SinglePaneLayout>
          <FacsimileView
            canvasId={canvasId}
            showNavigation={false}
            style={{height: '100%'}}
          />
        </SinglePaneLayout>
      )}
      {current && mode === 'transcription' && (
        <SinglePaneLayout>
          <TranscriptionView canvasId={current.id}/>
        </SinglePaneLayout>
      )}
      {current && mode === 'minimap' && (
        <SinglePaneLayout>
          <MinimapView canvasId={current.id}/>
        </SinglePaneLayout>
      )}
    </div>
  );
}

