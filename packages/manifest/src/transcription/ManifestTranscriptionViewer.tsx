import {
  useIsLayoutElementsVisible,
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
  const showLayoutElements = useIsLayoutElementsVisible();

  const content =
    transcriptionMode === 'line-by-line' ? (
      <ManifestLineByLineViewer
        showLayoutElements={showLayoutElements}
        onCanvasChange={onCanvasChange}
      />
    ) : (
      <ManifestDiplomaticViewer
        showLayoutElements={showLayoutElements}
        onCanvasChange={onCanvasChange}
      />
    );

  return (
    <div className="transcription-viewer">
      <ManifestReadingToolbar>
        <ManifestTranscriptionControls />
      </ManifestReadingToolbar>
      {content}
    </div>
  );
}
