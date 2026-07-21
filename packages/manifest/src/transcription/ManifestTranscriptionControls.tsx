import {
  IconReset,
  IconTranscriptionDiplomatic,
  IconTranscriptionNormalised,
  IconZoomIn,
  IconZoomOut,
} from '@globalise/design';
import {
  ToggleGroup,
  Toggle,
  ToolButton,
  Tooltip,
} from '@globalise/design/viewer';
import {
  setDiplomaticViewScale,
  setTranscriptionMode,
  useDiplomaticViewScale,
  useTranscriptionMode,
} from '@globalise/common/document';
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
      <ToggleGroup
        aria-label="Transcription mode controls"
        className="manifest-document-layout__transcription-mode-group"
        selectionMode="single"
        selectedKeys={[transcriptionMode]}
        size="compact"
      >
        <Tooltip label="Line by line transcription">
          <Toggle
            id="line-by-line"
            aria-label="Line by line transcription"
            className="manifest-document-layout__transcription-mode-item"
            icon={
              <IconTranscriptionNormalised className="manifest-document-layout__transcription-mode-icon" />
            }
            onPress={() => setTranscriptionMode('line-by-line')}
            size="compact"
          />
        </Tooltip>
        <Tooltip label="Diplomatic transcription">
          <Toggle
            id="diplomatic"
            aria-label="Diplomatic transcription"
            className="manifest-document-layout__transcription-mode-item"
            icon={
              <IconTranscriptionDiplomatic className="manifest-document-layout__transcription-mode-icon" />
            }
            onPress={() => setTranscriptionMode('diplomatic')}
            size="compact"
          />
        </Tooltip>
      </ToggleGroup>
      <div className="zoom-segment">
        <ToolButton
          aria-label="Zoom out transcription"
          className="button"
          icon={
            <IconZoomOut className="icon" />
          }
          onPress={() => applyZoomPercent(diplomaticViewScale - 10)}
          size="compact"
        />
        <label className="zoom-field">
          <input
            aria-label="Transcription zoom percentage, 30 to 200"
            className="zoom-input"
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
            className="zoom-suffix"
          >
            %
          </span>
        </label>
        <ToolButton
          aria-label="Zoom in transcription"
          className="button"
          icon={
            <IconZoomIn className="icon" />
          }
          onPress={() => applyZoomPercent(diplomaticViewScale + 10)}
          size="compact"
        />
      </div>
      <span
        className="divider"
        aria-hidden="true"
      />
      <ToolButton
        aria-label="Reset transcription zoom"
        className="button"
        icon={<IconReset className="icon" />}
        onPress={() => applyZoomPercent(100)}
        size="compact"
      />
    </div>
  );
}
