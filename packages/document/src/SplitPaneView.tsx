import {FacsimileView} from '@globalise/facsimile';
import {Id} from '@globalise/common/annotation';
import {TranscriptionView} from './TranscriptionView';
import {SplitPaneLayout} from './layout/SplitPaneLayout';
import {useCanvasPages} from './useCanvasPages';

import './SplitPaneView.css';

type SplitPaneViewProps = {
  manifestUrl: string;
  canvasId: string;
  onPageChange: (id: Id) => void;
};

export function SplitPaneView(
  {canvasId, onPageChange}: SplitPaneViewProps
) {
  const isPageInit = useCanvasPages(canvasId, onPageChange);

  if (!isPageInit) {
    return <div>Loading...</div>;
  }

  return (
    <SplitPaneLayout>
      <FacsimileView canvasId={canvasId} style={{height: '100%'}} />
      <TranscriptionView canvasId={canvasId}/>
    </SplitPaneLayout>
  );
}