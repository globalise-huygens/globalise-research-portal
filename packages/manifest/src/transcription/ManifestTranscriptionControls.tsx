import {
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailToolButton,
  DocumentDetailTooltip,
  IconTranscriptionDiplomatic,
  IconTranscriptionNormalised,
  IconZoomIn,
  IconZoomOut,
} from '@globalise/design';
import {
  setDiplomaticViewScale,
  setTranscriptionMode,
  useDiplomaticViewScale,
  useTranscriptionMode,
} from '@globalise/document';

export function ManifestTranscriptionControls() {
  const readTranscriptionMode = useTranscriptionMode as () =>
    | 'diplomatic'
    | 'line-by-line';
  const readDiplomaticViewScale = useDiplomaticViewScale as () => number;
  const setMode = setTranscriptionMode;
  const setScale = setDiplomaticViewScale;

  const transcriptionMode = readTranscriptionMode();
  const diplomaticViewScale = readDiplomaticViewScale();
  const showDiplomatic = transcriptionMode === 'diplomatic';

  return (
    <div className="manifest-document-layout__transcription-toolbar">
      <DocumentDetailSegmentedToggleGroup
        aria-label="Transcription mode controls"
        className="manifest-document-layout__transcription-mode-group"
        selectionMode="single"
        selectedKeys={[transcriptionMode]}
        size="compact"
      >
        <DocumentDetailTooltip label="Line by line transcription">
          <DocumentDetailSegmentedToggleItem
            id="line-by-line"
            aria-label="Line by line transcription"
            className="manifest-document-layout__transcription-mode-item"
            icon={
              <IconTranscriptionNormalised className="manifest-document-layout__transcription-mode-icon" />
            }
            onPress={() => setMode('line-by-line')}
            size="compact"
          />
        </DocumentDetailTooltip>
        <DocumentDetailTooltip label="Diplomatic transcription">
          <DocumentDetailSegmentedToggleItem
            id="diplomatic"
            aria-label="Diplomatic transcription"
            className="manifest-document-layout__transcription-mode-item"
            icon={
              <IconTranscriptionDiplomatic className="manifest-document-layout__transcription-mode-icon" />
            }
            onPress={() => setMode('diplomatic')}
            size="compact"
          />
        </DocumentDetailTooltip>
      </DocumentDetailSegmentedToggleGroup>
      {showDiplomatic && (
        <div className="gds-document-detail-scan-toolbar__zoom-segment">
          <DocumentDetailToolButton
            aria-label="Zoom out transcription"
            className="gds-document-detail-scan-toolbar__button"
            icon={
              <IconZoomOut className="gds-document-detail-scan-toolbar__icon" />
            }
            onPress={() => setScale(Math.max(30, diplomaticViewScale - 10))}
            size="compact"
          />
          <span className="gds-document-detail-scan-toolbar__zoom-label">
            {diplomaticViewScale}%
          </span>
          <DocumentDetailToolButton
            aria-label="Zoom in transcription"
            className="gds-document-detail-scan-toolbar__button"
            icon={
              <IconZoomIn className="gds-document-detail-scan-toolbar__icon" />
            }
            onPress={() => setScale(Math.min(200, diplomaticViewScale + 10))}
            size="compact"
          />
        </div>
      )}
    </div>
  );
}
