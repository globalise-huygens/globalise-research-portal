import {
  IconBrightness,
  IconContrast,
  IconDownload,
  IconInvert,
  IconReset,
  IconRotate,
  IconSaturation,
  IconSearch,
  IconSetting,
  IconTableOfContent,
  IconTextSpacing,
  IconTextType,
  IconTranscriptionDiplomatic,
  IconTranscriptionNormalised,
  IconViewModeMenu,
  IconZoomIn,
  IconZoomOut,
} from '../../../icons';
import { useEffect, useId, useRef, useState } from 'react';
import {
  FacsimileCanvas,
  TranscriptionCanvas,
} from '../Canvases';
import {
  ViewerCheckbox,
  ViewerToggleGroup,
  ViewerToggle,
  ViewerToolButton,
} from '../Controls';
import { ManifestViewerIconButton } from './Controls';
import { ViewerPane } from '../Layout';
import type {
  ManifestViewerScan,
  ManifestViewerScanRenderer,
} from './Types';
import {
  ViewerFloatingToolbar,
  ViewerPopover,
} from '../Surfaces';

export type TranscriptMode = 'normalised' | 'diplomatic';

function getScanRenderArgs(scan: ManifestViewerScan) {
  return {
    scan,
    label: `Scan ${scan.archiveScan}`,
    pageCount: scan.pages?.length === 2 ? (2 as const) : (1 as const),
  };
}

function clampZoomValue(value: number) {
  return Math.min(400, Math.max(10, Math.round(value)));
}

function getSliderFillStyle(value: number, min: number, max: number) {
  const percent = ((value - min) / (max - min)) * 100;

  return {
    ['--slider-fill' as string]: `${percent}%`,
  };
}

export function ManuscriptPane({
  currentScan,
  isVisible,
  renderScanPage,
  showMiniTranscript,
}: {
  currentScan: ManifestViewerScan;
  isVisible: boolean;
  renderScanPage: ManifestViewerScanRenderer;
  showMiniTranscript?: boolean;
}) {
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomInput, setZoomInput] = useState('100');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isInverted, setIsInverted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const settingsPanelId = useId();
  const settingsButtonContainerRef = useRef<HTMLDivElement | null>(null);
  const settingsPanelRef = useRef<HTMLDivElement | null>(null);

  const scanFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) invert(${isInverted ? 1 : 0})`;

  const resetScanAdjustments = () => {
    applyZoomValue(100);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setIsInverted(false);
    setRotation(0);
  };

  const updateBrightness = (value: string) => {
    setBrightness(Number(value));
  };

  const updateContrast = (value: string) => {
    setContrast(Number(value));
  };

  const updateSaturation = (value: string) => {
    setSaturation(Number(value));
  };

  const applyZoomValue = (nextValue: number) => {
    const clamped = clampZoomValue(nextValue);

    setZoomPercent(clamped);
    setZoomInput(String(clamped));
  };

  const commitZoomInput = () => {
    const parsed = Number.parseInt(zoomInput, 10);

    if (Number.isNaN(parsed)) {
      setZoomInput(String(zoomPercent));
      return;
    }

    applyZoomValue(parsed);
  };

  useEffect(() => {
    if (!isSettingsOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        settingsButtonContainerRef.current?.contains(target) ||
        settingsPanelRef.current?.contains(target)
      ) {
        return;
      }

      setIsSettingsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsSettingsOpen(false);
      const button =
        settingsButtonContainerRef.current?.querySelector('button');

      if (button instanceof HTMLButtonElement) {
        button.focus();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSettingsOpen]);

  return (
    <ViewerPane hidden={!isVisible}>
      <FacsimileCanvas className="manifest-viewer-manuscript-canvas">
        <ViewerFloatingToolbar className="manifest-viewer-floating-toolbar">
          <div className="manifest-viewer-zoom-segmented">
            <ManifestViewerIconButton
              aria-label="Zoom out"
              tooltip="Zoom out"
              icon={<IconZoomOut className="manifest-viewer-icon" />}
              onPress={() => applyZoomValue(zoomPercent - 10)}
              variant="quiet"
            />
            <label className="manifest-viewer-zoom-field">
              <input
                aria-label="Scan zoom percentage"
                className="manifest-viewer-zoom-field-input"
                inputMode="numeric"
                maxLength={3}
                value={zoomInput}
                onChange={(event) => {
                  const nextInput = event.currentTarget.value.replace(
                    /[^\d]/g,
                    '',
                  );
                  setZoomInput(nextInput);
                }}
                onBlur={commitZoomInput}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    commitZoomInput();
                  }
                }}
              />
              <span className="manifest-viewer-zoom-field-suffix">
                %
              </span>
            </label>
            <ManifestViewerIconButton
              aria-label="Zoom in"
              tooltip="Zoom in"
              icon={<IconZoomIn className="manifest-viewer-icon" />}
              onPress={() => applyZoomValue(zoomPercent + 10)}
              variant="quiet"
            />
          </div>
          <ManifestViewerIconButton
            aria-label="Reset scan view"
            tooltip="Reset scan view"
            icon={<IconReset className="manifest-viewer-icon" />}
            onPress={resetScanAdjustments}
            variant="quiet"
          />
          <ManifestViewerIconButton
            aria-label="Rotate scan"
            tooltip="Rotate scan"
            icon={<IconRotate className="manifest-viewer-icon" />}
            onPress={() => {
              setRotation((currentRotation) => (currentRotation + 90) % 360);
            }}
            variant="quiet"
          />
          <div
            ref={settingsButtonContainerRef}
            className="manifest-viewer-scan-settings"
          >
            <ManifestViewerIconButton
              aria-label="Scan settings"
              aria-controls={settingsPanelId}
              aria-expanded={isSettingsOpen}
              tooltip="Scan settings"
              icon={<IconSetting className="manifest-viewer-icon" />}
              isActive={isSettingsOpen}
              onPress={() => setIsSettingsOpen((open) => !open)}
              variant="quiet"
            />
            {isSettingsOpen && (
              <div
                ref={settingsPanelRef}
                id={settingsPanelId}
                className="manifest-viewer-scan-settings-panel"
              >
                <ViewerPopover
                  variant="default"
                  className="manifest-viewer-scan-settings-surface"
                >
                  <div className="manifest-viewer-scan-settings-controls">
                    <div className="manifest-viewer-scan-settings-row">
                      <div className="manifest-viewer-scan-settings-label">
                        <IconBrightness className="manifest-viewer-icon manifest-viewer-icon-medium" />
                        <span>Brightness</span>
                      </div>
                      <input
                        aria-label="Brightness"
                        className="manifest-viewer-scan-settings-slider"
                        type="range"
                        min={50}
                        max={150}
                        step={1}
                        value={brightness}
                        style={getSliderFillStyle(brightness, 50, 150)}
                        onInput={(event) => {
                          updateBrightness(event.currentTarget.value);
                        }}
                        onChange={(event) => {
                          updateBrightness(event.currentTarget.value);
                        }}
                      />
                      <span className="manifest-viewer-scan-settings-value">
                        {brightness}%
                      </span>
                    </div>
                    <div className="manifest-viewer-scan-settings-row">
                      <div className="manifest-viewer-scan-settings-label">
                        <IconContrast className="manifest-viewer-icon manifest-viewer-icon-medium" />
                        <span>Contrast</span>
                      </div>
                      <input
                        aria-label="Contrast"
                        className="manifest-viewer-scan-settings-slider"
                        type="range"
                        min={50}
                        max={150}
                        step={1}
                        value={contrast}
                        style={getSliderFillStyle(contrast, 50, 150)}
                        onInput={(event) => {
                          updateContrast(event.currentTarget.value);
                        }}
                        onChange={(event) => {
                          updateContrast(event.currentTarget.value);
                        }}
                      />
                      <span className="manifest-viewer-scan-settings-value">
                        {contrast}%
                      </span>
                    </div>
                    <div className="manifest-viewer-scan-settings-row">
                      <div className="manifest-viewer-scan-settings-label">
                        <IconSaturation className="manifest-viewer-icon manifest-viewer-icon-medium" />
                        <span>Saturation</span>
                      </div>
                      <input
                        aria-label="Saturation"
                        className="manifest-viewer-scan-settings-slider"
                        type="range"
                        min={0}
                        max={200}
                        step={1}
                        value={saturation}
                        style={getSliderFillStyle(saturation, 0, 200)}
                        onInput={(event) => {
                          updateSaturation(event.currentTarget.value);
                        }}
                        onChange={(event) => {
                          updateSaturation(event.currentTarget.value);
                        }}
                      />
                      <span className="manifest-viewer-scan-settings-value">
                        {saturation}%
                      </span>
                    </div>
                    <div className="manifest-viewer-scan-settings-row manifest-viewer-scan-settings-row--invert">
                      <div className="manifest-viewer-scan-settings-label">
                        <IconInvert className="manifest-viewer-icon manifest-viewer-icon-medium" />
                        <span>Invert</span>
                      </div>
                      <ViewerCheckbox
                        aria-label="Invert scan image"
                        className="manifest-viewer-scan-settings-checkbox"
                        isSelected={isInverted}
                        onChange={setIsInverted}
                      >
                        Invert scan image
                      </ViewerCheckbox>
                    </div>
                  </div>
                </ViewerPopover>
              </div>
            )}
          </div>
          <ManifestViewerIconButton
            aria-label="Download scan"
            tooltip="Download scan"
            icon={<IconDownload className="manifest-viewer-icon" />}
            variant="quiet"
          />
        </ViewerFloatingToolbar>

        <div className="manifest-viewer-page-frame">
          <div
            className="manifest-viewer-scan-filter"
            style={{
              filter: scanFilter,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {renderScanPage(getScanRenderArgs(currentScan))}
          </div>
        </div>

        {showMiniTranscript && (
          <div className="manifest-viewer-mini-window">
            <span>Transcription</span>
            <div>
              {Array.from({ length: 8 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
          </div>
        )}
      </FacsimileCanvas>
    </ViewerPane>
  );
}

export function TranscriptPane({
  currentScan,
  isVisible,
  lines,
  renderScanPage,
  transcriptMode,
  onTranscriptModeChange,
  showMiniScan,
}: {
  currentScan: ManifestViewerScan;
  isVisible: boolean;
  lines: string[];
  renderScanPage: ManifestViewerScanRenderer;
  transcriptMode: TranscriptMode;
  onTranscriptModeChange: (mode: TranscriptMode) => void;
  showMiniScan?: boolean;
}) {
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomInput, setZoomInput] = useState('100');
  const [isViewModeMenuOpen, setIsViewModeMenuOpen] = useState(false);
  const [isTranscriptSettingsOpen, setIsTranscriptSettingsOpen] =
    useState(false);
  const [transcriptViewMode, setTranscriptViewMode] = useState<
    'table' | 'search'
  >('table');
  const [transcriptFontFamily, setTranscriptFontFamily] = useState<
    'sans' | 'serif'
  >('sans');
  const [transcriptTextSize, setTranscriptTextSize] = useState(18);
  const [transcriptLineSpacing, setTranscriptLineSpacing] = useState(1.45);
  const viewModeMenuId = useId();
  const transcriptSettingsId = useId();
  const viewModeTriggerRef = useRef<HTMLDivElement | null>(null);
  const viewModePanelRef = useRef<HTMLDivElement | null>(null);
  const transcriptSettingsTriggerRef = useRef<HTMLDivElement | null>(null);
  const transcriptSettingsPanelRef = useRef<HTMLDivElement | null>(null);

  const applyZoomValue = (nextValue: number) => {
    const clamped = clampZoomValue(nextValue);

    setZoomPercent(clamped);
    setZoomInput(String(clamped));
  };

  const commitZoomInput = () => {
    const parsed = Number.parseInt(zoomInput, 10);

    if (Number.isNaN(parsed)) {
      setZoomInput(String(zoomPercent));
      return;
    }

    applyZoomValue(parsed);
  };

  const closeTranscriptPanels = () => {
    setIsViewModeMenuOpen(false);
    setIsTranscriptSettingsOpen(false);
  };

  const resetTranscriptAdjustments = () => {
    applyZoomValue(100);
    onTranscriptModeChange('normalised');
    setTranscriptViewMode('table');
    setTranscriptFontFamily('sans');
    setTranscriptTextSize(18);
    setTranscriptLineSpacing(1.45);
    closeTranscriptPanels();
  };

  const transcriptPageStyle = {
    fontFamily:
      transcriptFontFamily === 'serif'
        ? 'var(--font-serif)'
        : 'var(--font-sans)',
    fontSize: `${transcriptTextSize}px`,
    lineHeight: transcriptLineSpacing,
  };

  useEffect(() => {
    if (!isViewModeMenuOpen && !isTranscriptSettingsOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        viewModeTriggerRef.current?.contains(target) ||
        viewModePanelRef.current?.contains(target) ||
        transcriptSettingsTriggerRef.current?.contains(target) ||
        transcriptSettingsPanelRef.current?.contains(target)
      ) {
        return;
      }

      closeTranscriptPanels();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      closeTranscriptPanels();
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isViewModeMenuOpen, isTranscriptSettingsOpen]);

  return (
    <ViewerPane hidden={!isVisible}>
      <TranscriptionCanvas className="manifest-viewer-transcript-canvas">
        <ViewerFloatingToolbar
          align="end"
          className="manifest-viewer-floating-toolbar"
        >
          <ViewerToggleGroup
            aria-label="Transcription view mode"
            className="manifest-viewer-transcript-mode-group"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={new Set([transcriptMode])}
            onSelectionChange={(keys) => {
              const nextKey = Array.from(keys)[0];

              if (nextKey === 'normalised' || nextKey === 'diplomatic') {
                onTranscriptModeChange(nextKey);
              }
            }}
            size="compact"
          >
            <ViewerToggle
              id="normalised"
              aria-label="Show normalised transcription"
              size="compact"
            >
              <IconTranscriptionNormalised className="manifest-viewer-icon" />
            </ViewerToggle>
            <ViewerToggle
              id="diplomatic"
              aria-label="Show diplomatic transcription"
              size="compact"
            >
              <IconTranscriptionDiplomatic className="manifest-viewer-icon" />
            </ViewerToggle>
          </ViewerToggleGroup>

          <div className="manifest-viewer-zoom-segmented">
            <ManifestViewerIconButton
              aria-label="Zoom out"
              tooltip="Zoom out"
              icon={<IconZoomOut className="manifest-viewer-icon" />}
              onPress={() => applyZoomValue(zoomPercent - 10)}
              variant="quiet"
            />
            <label className="manifest-viewer-zoom-field">
              <input
                aria-label="Transcription zoom percentage"
                className="manifest-viewer-zoom-field-input"
                inputMode="numeric"
                maxLength={3}
                value={zoomInput}
                onChange={(event) => {
                  const nextInput = event.currentTarget.value.replace(
                    /[^\d]/g,
                    '',
                  );
                  setZoomInput(nextInput);
                }}
                onBlur={commitZoomInput}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    commitZoomInput();
                  }
                }}
              />
              <span className="manifest-viewer-zoom-field-suffix">
                %
              </span>
            </label>
            <ManifestViewerIconButton
              aria-label="Zoom in"
              tooltip="Zoom in"
              icon={<IconZoomIn className="manifest-viewer-icon" />}
              onPress={() => applyZoomValue(zoomPercent + 10)}
              variant="quiet"
            />
          </div>

          <div
            ref={viewModeTriggerRef}
            className="manifest-viewer-toolbar-dropdown"
          >
            <ManifestViewerIconButton
              aria-controls={viewModeMenuId}
              aria-expanded={isViewModeMenuOpen}
              aria-label="Transcript view modes"
              tooltip="View mode"
              icon={
                <IconViewModeMenu className="manifest-viewer-icon" />
              }
              isActive={isViewModeMenuOpen}
              onPress={() => {
                setIsTranscriptSettingsOpen(false);
                setIsViewModeMenuOpen((open) => !open);
              }}
              variant="quiet"
            />
            {isViewModeMenuOpen && (
              <div
                ref={viewModePanelRef}
                id={viewModeMenuId}
                className="manifest-viewer-transcript-menu-panel"
              >
                <ViewerPopover
                  className="manifest-viewer-transcript-menu-surface"
                  size="compact"
                  variant="default"
                >
                  <div className="manifest-viewer-transcript-menu-items">
                    <ViewerToolButton
                      aria-label="Table view"
                      className="manifest-viewer-transcript-menu-item"
                      icon={
                        <IconTableOfContent className="manifest-viewer-icon" />
                      }
                      isActive={transcriptViewMode === 'table'}
                      onPress={() => {
                        setTranscriptViewMode('table');
                        setIsViewModeMenuOpen(false);
                      }}
                      size="compact"
                    >
                      Table view
                    </ViewerToolButton>
                    <ViewerToolButton
                      aria-label="Search transcript"
                      className="manifest-viewer-transcript-menu-item"
                      icon={
                        <IconSearch className="manifest-viewer-icon" />
                      }
                      isActive={transcriptViewMode === 'search'}
                      onPress={() => {
                        setTranscriptViewMode('search');
                        setIsViewModeMenuOpen(false);
                      }}
                      size="compact"
                    >
                      Search transcript
                    </ViewerToolButton>
                  </div>
                </ViewerPopover>
              </div>
            )}
          </div>

          <ManifestViewerIconButton
            aria-label="Reset transcription"
            tooltip="Reset transcription"
            icon={<IconReset className="manifest-viewer-icon" />}
            onPress={resetTranscriptAdjustments}
            variant="quiet"
          />

          <div
            ref={transcriptSettingsTriggerRef}
            className="manifest-viewer-toolbar-dropdown"
          >
            <ManifestViewerIconButton
              aria-controls={transcriptSettingsId}
              aria-expanded={isTranscriptSettingsOpen}
              aria-label="Transcript settings"
              tooltip="Transcript settings"
              icon={<IconSetting className="manifest-viewer-icon" />}
              isActive={isTranscriptSettingsOpen}
              onPress={() => {
                setIsViewModeMenuOpen(false);
                setIsTranscriptSettingsOpen((open) => !open);
              }}
              variant="quiet"
            />
            {isTranscriptSettingsOpen && (
              <div
                ref={transcriptSettingsPanelRef}
                id={transcriptSettingsId}
                className="manifest-viewer-transcript-settings-panel"
              >
                <ViewerPopover
                  className="manifest-viewer-transcript-settings-surface"
                  size="default"
                  variant="default"
                >
                  <div className="manifest-viewer-transcript-settings-controls">
                    <ViewerToggleGroup
                      aria-label="Transcript typeface"
                      className="manifest-viewer-transcript-type-group"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={new Set([transcriptFontFamily])}
                      onSelectionChange={(keys) => {
                        const nextKey = Array.from(keys)[0];

                        if (nextKey === 'sans' || nextKey === 'serif') {
                          setTranscriptFontFamily(nextKey);
                        }
                      }}
                      size="compact"
                    >
                      <ViewerToggle
                        id="sans"
                        aria-label="Use sans serif"
                        size="compact"
                      >
                        Sans
                      </ViewerToggle>
                      <ViewerToggle
                        id="serif"
                        aria-label="Use serif"
                        size="compact"
                      >
                        Serif
                      </ViewerToggle>
                    </ViewerToggleGroup>

                    <div className="manifest-viewer-transcript-settings-row">
                      <div className="manifest-viewer-transcript-settings-label">
                        <IconTextType className="manifest-viewer-icon manifest-viewer-icon-medium" />
                        <span>Type size</span>
                      </div>
                      <input
                        aria-label="Transcript type size"
                        className="manifest-viewer-transcript-settings-slider"
                        max={24}
                        min={14}
                        step={1}
                        type="range"
                        value={transcriptTextSize}
                        style={getSliderFillStyle(transcriptTextSize, 14, 24)}
                        onInput={(event) => {
                          setTranscriptTextSize(
                            Number(event.currentTarget.value),
                          );
                        }}
                        onChange={(event) => {
                          setTranscriptTextSize(
                            Number(event.currentTarget.value),
                          );
                        }}
                      />
                      <span className="manifest-viewer-transcript-settings-value">
                        {transcriptTextSize}px
                      </span>
                    </div>

                    <div className="manifest-viewer-transcript-settings-row">
                      <div className="manifest-viewer-transcript-settings-label">
                        <IconTextSpacing className="manifest-viewer-icon manifest-viewer-icon-medium" />
                        <span>Spacing</span>
                      </div>
                      <input
                        aria-label="Transcript spacing"
                        className="manifest-viewer-transcript-settings-slider"
                        max={2}
                        min={1.2}
                        step={0.05}
                        type="range"
                        value={transcriptLineSpacing}
                        style={getSliderFillStyle(
                          transcriptLineSpacing,
                          1.2,
                          2,
                        )}
                        onInput={(event) => {
                          setTranscriptLineSpacing(
                            Number(event.currentTarget.value),
                          );
                        }}
                        onChange={(event) => {
                          setTranscriptLineSpacing(
                            Number(event.currentTarget.value),
                          );
                        }}
                      />
                      <span className="manifest-viewer-transcript-settings-value">
                        {transcriptLineSpacing.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </ViewerPopover>
              </div>
            )}
          </div>

          <ManifestViewerIconButton
            aria-label="Download transcript"
            tooltip="Download transcript"
            icon={<IconDownload className="manifest-viewer-icon" />}
            variant="quiet"
          />
        </ViewerFloatingToolbar>

        <div className="manifest-viewer-transcript-scroll">
          <div
            className="manifest-viewer-transcript-page"
            data-mode={transcriptMode}
            data-view-mode={transcriptViewMode}
            style={transcriptPageStyle}
          >
            {lines.map((line, index) => (
              <p key={`${index}-${line}`}>
                <span>{index + 1}</span>
                {transcriptMode === 'diplomatic' ? line.toLowerCase() : line}
              </p>
            ))}
          </div>
        </div>

        {showMiniScan && (
          <div className="manifest-viewer-mini-window">
            <span>Scan</span>
            {renderScanPage(getScanRenderArgs(currentScan))}
          </div>
        )}
      </TranscriptionCanvas>
    </ViewerPane>
  );
}
