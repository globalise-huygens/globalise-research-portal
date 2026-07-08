import {
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailToolButton,
  DocumentDetailTooltip,
  IconReset,
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
import { useState } from 'react';

const MIN_ZOOM_PERCENT = 30;
const MAX_ZOOM_PERCENT = 200;

export function ManifestTranscriptionControls() {
  const transcriptionMode = useTranscriptionMode();
  const diplomaticViewScale = useDiplomaticViewScale();
  const [zoomInput, setZoomInput] = useState<string | null>(null);
  const zoomInputValue = zoomInput ?? String(diplomaticViewScale);

  function applyZoomPercent(value: number) {
    const nextZoomPercent = Math.min(
      Math.max(value, MIN_ZOOM_PERCENT),
      MAX_ZOOM_PERCENT,
    );
    setDiplomaticViewScale(nextZoomPercent);
    setZoomInput(null);
  }

  function commitZoomInput() {
    const parsed = Number.parseInt(zoomInputValue, 10);
    if (Number.isNaN(parsed)) {
      setZoomInput(null);
      return;
    }
    applyZoomPercent(parsed);
  }

  function handleZoomInputChange(value: string) {
    const nextValue = value.replace(/[^\d]/g, '').slice(0, 3);
    const parsed = Number.parseInt(nextValue, 10);
    setZoomInput(nextValue);
    if (
      !Number.isNaN(parsed) &&
      parsed >= MIN_ZOOM_PERCENT &&
      parsed <= MAX_ZOOM_PERCENT
    ) {
      setDiplomaticViewScale(parsed);
    }
  }

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
            onPress={() => setTranscriptionMode('line-by-line')}
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
            onPress={() => setTranscriptionMode('diplomatic')}
            size="compact"
          />
        </DocumentDetailTooltip>
      </DocumentDetailSegmentedToggleGroup>
      <div className="gds-document-detail-scan-toolbar__zoom-segment">
        <DocumentDetailToolButton
          aria-label="Zoom out transcription"
          className="gds-document-detail-scan-toolbar__button"
          icon={
            <IconZoomOut className="gds-document-detail-scan-toolbar__icon" />
          }
          onPress={() => applyZoomPercent(diplomaticViewScale - 10)}
          size="compact"
        />
        <label className="gds-document-detail-scan-toolbar__zoom-field">
          <input
            aria-label="Transcription zoom percentage, 30 to 200"
            className="gds-document-detail-scan-toolbar__zoom-input"
            inputMode="numeric"
            maxLength={3}
            pattern="[0-9]*"
            type="text"
            value={zoomInputValue}
            onBlur={commitZoomInput}
            onChange={(event) => {
              handleZoomInputChange(event.currentTarget.value);
            }}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitZoomInput();
              }
            }}
          />
          <span
            aria-hidden="true"
            className="gds-document-detail-scan-toolbar__zoom-suffix"
          >
            %
          </span>
        </label>
        <DocumentDetailToolButton
          aria-label="Zoom in transcription"
          className="gds-document-detail-scan-toolbar__button"
          icon={
            <IconZoomIn className="gds-document-detail-scan-toolbar__icon" />
          }
          onPress={() => applyZoomPercent(diplomaticViewScale + 10)}
          size="compact"
        />
      </div>
      <span
        className="gds-document-detail-scan-toolbar__divider"
        aria-hidden="true"
      />
      <DocumentDetailToolButton
        aria-label="Reset transcription zoom"
        className="gds-document-detail-scan-toolbar__button"
        icon={<IconReset className="gds-document-detail-scan-toolbar__icon" />}
        onPress={() => applyZoomPercent(100)}
        size="compact"
      />
    </div>
  );
}
