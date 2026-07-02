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
} from '../icons';
import { useEffect, useId, useRef, useState } from 'react';
import {
  DocumentDetailCanvas,
  DocumentDetailTranscriptCanvas,
} from './DocumentDetailCanvases';
import {
  DocumentDetailCheckbox,
  DocumentDetailIconButton,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailToolButton,
} from './DocumentDetailControls';
import { DocumentDetailViewerPane } from './DocumentDetailLayout';
import type {
  DocumentDetailOverlayScan,
  DocumentDetailOverlayScanRenderer,
} from './DocumentDetailOverlayTypes';
import {
  DocumentDetailFloatingToolbar,
  DocumentDetailPopoverSurface,
} from './DocumentDetailSurfaces';

export type TranscriptMode = 'normalised' | 'diplomatic';

function getScanRenderArgs(scan: DocumentDetailOverlayScan) {
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
  currentScan: DocumentDetailOverlayScan;
  isVisible: boolean;
  renderScanPage: DocumentDetailOverlayScanRenderer;
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
    <DocumentDetailViewerPane hidden={!isVisible}>
      <DocumentDetailCanvas className="document-detail-overlay-manuscript-canvas">
        <DocumentDetailFloatingToolbar className="document-detail-overlay-floating-toolbar">
          <div className="document-detail-overlay-zoom-segmented">
            <DocumentDetailIconButton
              aria-label="Zoom out"
              tooltip="Zoom out"
              icon={<IconZoomOut className="document-detail-overlay-icon" />}
              onPress={() => applyZoomValue(zoomPercent - 10)}
              variant="quiet"
            />
            <label className="document-detail-overlay-zoom-field">
              <input
                aria-label="Scan zoom percentage"
                className="document-detail-overlay-zoom-field-input"
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
              <span className="document-detail-overlay-zoom-field-suffix">
                %
              </span>
            </label>
            <DocumentDetailIconButton
              aria-label="Zoom in"
              tooltip="Zoom in"
              icon={<IconZoomIn className="document-detail-overlay-icon" />}
              onPress={() => applyZoomValue(zoomPercent + 10)}
              variant="quiet"
            />
          </div>
          <DocumentDetailIconButton
            aria-label="Reset scan view"
            tooltip="Reset scan view"
            icon={<IconReset className="document-detail-overlay-icon" />}
            onPress={resetScanAdjustments}
            variant="quiet"
          />
          <DocumentDetailIconButton
            aria-label="Rotate scan"
            tooltip="Rotate scan"
            icon={<IconRotate className="document-detail-overlay-icon" />}
            onPress={() => {
              setRotation((currentRotation) => (currentRotation + 90) % 360);
            }}
            variant="quiet"
          />
          <div
            ref={settingsButtonContainerRef}
            className="document-detail-overlay-scan-settings"
          >
            <DocumentDetailIconButton
              aria-label="Scan settings"
              aria-controls={settingsPanelId}
              aria-expanded={isSettingsOpen}
              tooltip="Scan settings"
              icon={<IconSetting className="document-detail-overlay-icon" />}
              isActive={isSettingsOpen}
              onPress={() => setIsSettingsOpen((open) => !open)}
              variant="quiet"
            />
            {isSettingsOpen && (
              <div
                ref={settingsPanelRef}
                id={settingsPanelId}
                className="document-detail-overlay-scan-settings-panel"
              >
                <DocumentDetailPopoverSurface
                  variant="default"
                  className="document-detail-overlay-scan-settings-surface"
                >
                  <div className="document-detail-overlay-scan-settings-controls">
                    <div className="document-detail-overlay-scan-settings-row">
                      <div className="document-detail-overlay-scan-settings-label">
                        <IconBrightness className="document-detail-overlay-icon document-detail-overlay-icon-medium" />
                        <span>Brightness</span>
                      </div>
                      <input
                        aria-label="Brightness"
                        className="document-detail-overlay-scan-settings-slider"
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
                      <span className="document-detail-overlay-scan-settings-value">
                        {brightness}%
                      </span>
                    </div>
                    <div className="document-detail-overlay-scan-settings-row">
                      <div className="document-detail-overlay-scan-settings-label">
                        <IconContrast className="document-detail-overlay-icon document-detail-overlay-icon-medium" />
                        <span>Contrast</span>
                      </div>
                      <input
                        aria-label="Contrast"
                        className="document-detail-overlay-scan-settings-slider"
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
                      <span className="document-detail-overlay-scan-settings-value">
                        {contrast}%
                      </span>
                    </div>
                    <div className="document-detail-overlay-scan-settings-row">
                      <div className="document-detail-overlay-scan-settings-label">
                        <IconSaturation className="document-detail-overlay-icon document-detail-overlay-icon-medium" />
                        <span>Saturation</span>
                      </div>
                      <input
                        aria-label="Saturation"
                        className="document-detail-overlay-scan-settings-slider"
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
                      <span className="document-detail-overlay-scan-settings-value">
                        {saturation}%
                      </span>
                    </div>
                    <div className="document-detail-overlay-scan-settings-row document-detail-overlay-scan-settings-row--invert">
                      <div className="document-detail-overlay-scan-settings-label">
                        <IconInvert className="document-detail-overlay-icon document-detail-overlay-icon-medium" />
                        <span>Invert</span>
                      </div>
                      <DocumentDetailCheckbox
                        aria-label="Invert scan image"
                        className="document-detail-overlay-scan-settings-checkbox"
                        isSelected={isInverted}
                        onChange={setIsInverted}
                      >
                        Invert scan image
                      </DocumentDetailCheckbox>
                    </div>
                  </div>
                </DocumentDetailPopoverSurface>
              </div>
            )}
          </div>
          <DocumentDetailIconButton
            aria-label="Download scan"
            tooltip="Download scan"
            icon={<IconDownload className="document-detail-overlay-icon" />}
            variant="quiet"
          />
        </DocumentDetailFloatingToolbar>

        <div className="document-detail-overlay-page-frame">
          <div
            className="document-detail-overlay-scan-filter"
            style={{
              filter: scanFilter,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {renderScanPage(getScanRenderArgs(currentScan))}
          </div>
        </div>

        {showMiniTranscript && (
          <div className="document-detail-overlay-mini-window">
            <span>Transcription</span>
            <div>
              {Array.from({ length: 8 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
          </div>
        )}
      </DocumentDetailCanvas>
    </DocumentDetailViewerPane>
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
  currentScan: DocumentDetailOverlayScan;
  isVisible: boolean;
  lines: string[];
  renderScanPage: DocumentDetailOverlayScanRenderer;
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
    <DocumentDetailViewerPane hidden={!isVisible}>
      <DocumentDetailTranscriptCanvas className="document-detail-overlay-rich-transcript-canvas">
        <DocumentDetailFloatingToolbar
          align="end"
          className="document-detail-overlay-floating-toolbar"
        >
          <DocumentDetailSegmentedToggleGroup
            aria-label="Transcription view mode"
            className="document-detail-overlay-transcript-mode-group"
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
            <DocumentDetailSegmentedToggleItem
              id="normalised"
              aria-label="Show normalised transcription"
              size="compact"
            >
              <IconTranscriptionNormalised className="document-detail-overlay-icon" />
            </DocumentDetailSegmentedToggleItem>
            <DocumentDetailSegmentedToggleItem
              id="diplomatic"
              aria-label="Show diplomatic transcription"
              size="compact"
            >
              <IconTranscriptionDiplomatic className="document-detail-overlay-icon" />
            </DocumentDetailSegmentedToggleItem>
          </DocumentDetailSegmentedToggleGroup>

          <div className="document-detail-overlay-zoom-segmented">
            <DocumentDetailIconButton
              aria-label="Zoom out"
              tooltip="Zoom out"
              icon={<IconZoomOut className="document-detail-overlay-icon" />}
              onPress={() => applyZoomValue(zoomPercent - 10)}
              variant="quiet"
            />
            <label className="document-detail-overlay-zoom-field">
              <input
                aria-label="Transcription zoom percentage"
                className="document-detail-overlay-zoom-field-input"
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
              <span className="document-detail-overlay-zoom-field-suffix">
                %
              </span>
            </label>
            <DocumentDetailIconButton
              aria-label="Zoom in"
              tooltip="Zoom in"
              icon={<IconZoomIn className="document-detail-overlay-icon" />}
              onPress={() => applyZoomValue(zoomPercent + 10)}
              variant="quiet"
            />
          </div>

          <div
            ref={viewModeTriggerRef}
            className="document-detail-overlay-toolbar-dropdown"
          >
            <DocumentDetailIconButton
              aria-controls={viewModeMenuId}
              aria-expanded={isViewModeMenuOpen}
              aria-label="Transcript view modes"
              tooltip="View mode"
              icon={
                <IconViewModeMenu className="document-detail-overlay-icon" />
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
                className="document-detail-overlay-transcript-menu-panel"
              >
                <DocumentDetailPopoverSurface
                  className="document-detail-overlay-transcript-menu-surface"
                  size="compact"
                  variant="default"
                >
                  <div className="document-detail-overlay-transcript-menu-items">
                    <DocumentDetailToolButton
                      aria-label="Table view"
                      className="document-detail-overlay-transcript-menu-item"
                      icon={
                        <IconTableOfContent className="document-detail-overlay-icon" />
                      }
                      isActive={transcriptViewMode === 'table'}
                      onPress={() => {
                        setTranscriptViewMode('table');
                        setIsViewModeMenuOpen(false);
                      }}
                      size="compact"
                    >
                      Table view
                    </DocumentDetailToolButton>
                    <DocumentDetailToolButton
                      aria-label="Search transcript"
                      className="document-detail-overlay-transcript-menu-item"
                      icon={
                        <IconSearch className="document-detail-overlay-icon" />
                      }
                      isActive={transcriptViewMode === 'search'}
                      onPress={() => {
                        setTranscriptViewMode('search');
                        setIsViewModeMenuOpen(false);
                      }}
                      size="compact"
                    >
                      Search transcript
                    </DocumentDetailToolButton>
                  </div>
                </DocumentDetailPopoverSurface>
              </div>
            )}
          </div>

          <DocumentDetailIconButton
            aria-label="Reset transcription"
            tooltip="Reset transcription"
            icon={<IconReset className="document-detail-overlay-icon" />}
            onPress={resetTranscriptAdjustments}
            variant="quiet"
          />

          <div
            ref={transcriptSettingsTriggerRef}
            className="document-detail-overlay-toolbar-dropdown"
          >
            <DocumentDetailIconButton
              aria-controls={transcriptSettingsId}
              aria-expanded={isTranscriptSettingsOpen}
              aria-label="Transcript settings"
              tooltip="Transcript settings"
              icon={<IconSetting className="document-detail-overlay-icon" />}
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
                className="document-detail-overlay-transcript-settings-panel"
              >
                <DocumentDetailPopoverSurface
                  className="document-detail-overlay-transcript-settings-surface"
                  size="default"
                  variant="default"
                >
                  <div className="document-detail-overlay-transcript-settings-controls">
                    <DocumentDetailSegmentedToggleGroup
                      aria-label="Transcript typeface"
                      className="document-detail-overlay-transcript-type-group"
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
                      <DocumentDetailSegmentedToggleItem
                        id="sans"
                        aria-label="Use sans serif"
                        size="compact"
                      >
                        Sans
                      </DocumentDetailSegmentedToggleItem>
                      <DocumentDetailSegmentedToggleItem
                        id="serif"
                        aria-label="Use serif"
                        size="compact"
                      >
                        Serif
                      </DocumentDetailSegmentedToggleItem>
                    </DocumentDetailSegmentedToggleGroup>

                    <div className="document-detail-overlay-transcript-settings-row">
                      <div className="document-detail-overlay-transcript-settings-label">
                        <IconTextType className="document-detail-overlay-icon document-detail-overlay-icon-medium" />
                        <span>Type size</span>
                      </div>
                      <input
                        aria-label="Transcript type size"
                        className="document-detail-overlay-transcript-settings-slider"
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
                      <span className="document-detail-overlay-transcript-settings-value">
                        {transcriptTextSize}px
                      </span>
                    </div>

                    <div className="document-detail-overlay-transcript-settings-row">
                      <div className="document-detail-overlay-transcript-settings-label">
                        <IconTextSpacing className="document-detail-overlay-icon document-detail-overlay-icon-medium" />
                        <span>Spacing</span>
                      </div>
                      <input
                        aria-label="Transcript spacing"
                        className="document-detail-overlay-transcript-settings-slider"
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
                      <span className="document-detail-overlay-transcript-settings-value">
                        {transcriptLineSpacing.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </DocumentDetailPopoverSurface>
              </div>
            )}
          </div>

          <DocumentDetailIconButton
            aria-label="Download transcript"
            tooltip="Download transcript"
            icon={<IconDownload className="document-detail-overlay-icon" />}
            variant="quiet"
          />
        </DocumentDetailFloatingToolbar>

        <div className="document-detail-overlay-transcript-scroll">
          <div
            className="document-detail-overlay-transcript-page"
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
          <div className="document-detail-overlay-mini-window">
            <span>Scan</span>
            {renderScanPage(getScanRenderArgs(currentScan))}
          </div>
        )}
      </DocumentDetailTranscriptCanvas>
    </DocumentDetailViewerPane>
  );
}
