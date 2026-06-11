import {
  useAnnotations,
  usePartOf,
  useSelectedIdsForCanvas,
} from '@globalise/common/document';
import { useSettings } from '@globalise/document';
import { DiplomaticView } from '@globalise/diplomatic';
import { LineByLineView } from '@globalise/line-by-line';

type CanvasTranscriptionProps = { canvasId: string };

export function CanvasTranscription({ canvasId }: CanvasTranscriptionProps) {
  const annotations = useAnnotations(canvasId);
  const partOf = usePartOf(canvasId);
  const selectedIds = useSelectedIdsForCanvas(canvasId);
  const { transcriptionMode } = useSettings();
  const showDiplomatic = transcriptionMode === 'diplomatic';

  if (showDiplomatic && partOf) {
    return (
      <DiplomaticView
        annotations={annotations}
        selected={selectedIds}
        page={partOf}
        fit="width"
        showBlocks={true}
        showScanMargin={true}
      />
    );
  }

  return <LineByLineView annotations={annotations} />;
}