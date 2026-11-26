import {
  useIsInReadingMode,
  useTranscriptionMode,
} from '@globalise/common/document';
import { ManifestReadingToolbar } from '../responsive/ManifestReadingToolbar';
import { ManifestDiplomaticViewer } from './ManifestDiplomaticViewer.tsx';
import { ManifestLineByLineViewer } from './ManifestLineByLineViewer.tsx';
import {
  ManifestTranscriptionControls,
} from './ManifestTranscriptionControls.tsx';

type Props = {
  onCanvasChange: (canvasId: string) => void;
};

export function ManifestTranscriptionViewer({
  onCanvasChange,
}: Props) {
  const transcriptionMode = useTranscriptionMode();
  const isInReadingMode = !useIsInReadingMode();

  const content =
    transcriptionMode === 'line-by-line' ? (
      <ManifestLineByLineViewer
        isInReadingMode={isInReadingMode}
        onCanvasChange={onCanvasChange}
      />
    ) : (
      <ManifestDiplomaticViewer
        isInReadingMode={isInReadingMode}
        onCanvasChange={onCanvasChange}
      />
    );

  return (
    <div className="transcription-viewer">
      <ManifestReadingToolbar showClassifiedHighlightControls>
        <ManifestTranscriptionControls />
      </ManifestReadingToolbar>
      {content}
    </div>
  );
}
