import {
  useAnnotations,
  usePartOf,
  useSelectedIdsForCanvas,
} from '@globalise/common/document';
import { useSettings } from '@globalise/document';
import { DiplomaticView } from '@globalise/diplomatic';
import { LineByLineView } from '@globalise/line-by-line';

type CanvasTranscriptionProps = {
  width: number
  canvasId: string
};

export function CanvasTranscription({ canvasId, width }: CanvasTranscriptionProps) {
  const annotations = useAnnotations(canvasId);
  const partOf = usePartOf(canvasId);
  const selectedIds = useSelectedIdsForCanvas(canvasId);
  const { transcriptionMode } = useSettings();
  const showDiplomatic = transcriptionMode === 'diplomatic';

  if (showDiplomatic && partOf) {
    return (
      <div style={{
        height: '100%',
        width: width,
      }}>
        <DiplomaticView
          id={canvasId}
          annotations={annotations}
          selected={selectedIds}
          page={partOf}
          fit="width"
          showBlocks={true}
          showScanMargin={true}
        />
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      width: '100%',
      overflow: 'auto',
      paddingTop: '1em',
      borderTop: '1px solid #ddd',
    }}>
      <LineByLineView canvasId={canvasId} annotations={annotations}/>;
    </div>
  );
}