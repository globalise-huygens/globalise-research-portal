import { FacsimileView } from '@globalise/facsimile';
import { Id } from '@globalise/common/annotation';
import { DocumentModeControls } from './DocumentModeControls';
import { SplitPaneLayout } from './layout/SplitPaneLayout';
import { TranscriptionView } from './TranscriptionView';
import { SinglePaneLayout } from './layout/SinglePaneLayout';
import { HeaderCanvasControls } from './HeaderCanvasControls';
import { MinimapView } from './minimap/MinimapView';
import { useSettings } from './SettingsStore';

import './DocumentView.css';
import { HeaderBar } from './layout/Header.tsx';
import { useDocumentLifecycle } from '@globalise/common/document';

type DocumentViewProps = {
  manifestUrl: string;
  canvasId?: string;
  onPageChange: (id: Id) => void;
};

export function DocumentView(
  { manifestUrl, canvasId, onPageChange }: DocumentViewProps,
) {
  const { documentMode: mode } = useSettings();
  const lifecycle = useDocumentLifecycle(manifestUrl, canvasId, onPageChange);

  if (lifecycle.phase === 'loading-manifest') {
    return <div>Loading...</div>;
  }

  const annotationsReady = lifecycle.phase === 'annotations-ready';

  return (
    <div className="document-view" style={{ height: '100%' }}>
      <HeaderBar/>
      <HeaderCanvasControls/>
      <DocumentModeControls/>
      {mode === 'split' && (
        <SplitPaneLayout>
          <FacsimileView
            canvasId={lifecycle.canvasId}
            showNavigation={false}
            style={{ height: '100%' }}
          />
          {annotationsReady && (
            <TranscriptionView canvasId={lifecycle.canvasId}/>
          )}
        </SplitPaneLayout>
      )}
      {mode === 'facsimile' && (
        <SinglePaneLayout>
          <FacsimileView
            canvasId={lifecycle.canvasId}
            showNavigation={false}
            style={{ height: '100%' }}
          />
        </SinglePaneLayout>
      )}
      {mode === 'transcription' && annotationsReady && (
        <SinglePaneLayout>
          <TranscriptionView canvasId={lifecycle.canvasId}/>
        </SinglePaneLayout>
      )}
      {mode === 'minimap' && (
        <SinglePaneLayout>
          <MinimapView canvasId={lifecycle.canvasId}/>
        </SinglePaneLayout>
      )}
    </div>
  );
}
