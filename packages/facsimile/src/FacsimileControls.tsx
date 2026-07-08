import {
  IconBrightness,
  IconContrast,
  IconInvert,
  DocumentDetailToolButton,
  IconReset,
  IconRotate,
  IconSaturation,
  IconSetting,
  IconZoomIn,
  IconZoomOut,
} from '@globalise/design';
import { useViewer, useViewerControls } from '@knaw-huc/osd-iiif-viewer';
import { type Point, type Rect } from 'openseadragon';
import {
  type CSSProperties,
  type RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type FacsimileControlBarProps = {
  fullscreenRef: RefObject<HTMLDivElement | null>;
  onScanFilterChange?: (filter: string) => void;
};

const MIN_ZOOM_PERCENT = 10;
const MAX_ZOOM_PERCENT = 400;
const DEFAULT_SCAN_FILTER_VALUE = 100;
const SETTINGS_PANEL_WIDTH = 320;
const SETTINGS_PANEL_MARGIN = 12;
const SETTINGS_PANEL_MIN_HEIGHT = 140;

function getSliderFillStyle(value: number, min: number, max: number) {
  const percent = ((value - min) / (max - min)) * 100;

  return {
    ['--slider-fill' as string]: `${percent}%`,
  };
}

export function FacsimileControls({
  fullscreenRef,
  onScanFilterChange,
}: FacsimileControlBarProps) {
  const viewer = useViewer();
  const { home, rotate, rotation } = useViewerControls(fullscreenRef);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomInput, setZoomInput] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [brightness, setBrightness] = useState(DEFAULT_SCAN_FILTER_VALUE);
  const [contrast, setContrast] = useState(DEFAULT_SCAN_FILTER_VALUE);
  const [saturation, setSaturation] = useState(DEFAULT_SCAN_FILTER_VALUE);
  const [isInverted, setIsInverted] = useState(false);
  const [settingsPanelStyle, setSettingsPanelStyle] =
    useState<CSSProperties | null>(null);
  const initialViewRef = useRef<{ zoom: number; center: Point } | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const settingsPanelId = useId();

  const zoomInputValue = zoomInput ?? String(zoomPercent);
  const scanFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) invert(${isInverted ? 1 : 0})`;

  useEffect(() => {
    if (!viewer) {
      initialViewRef.current = null;
      return;
    }
    let nextFrameId: number | null = null;
    const frameId = requestAnimationFrame(() => {
      nextFrameId = requestAnimationFrame(() => {
        initialViewRef.current = {
          zoom: viewer.viewport.getZoom(),
          center: viewer.viewport.getCenter(),
        };
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      if (nextFrameId !== null) {
        cancelAnimationFrame(nextFrameId);
      }
    };
  }, [viewer]);

  useEffect(() => {
    onScanFilterChange?.(scanFilter);
  }, [onScanFilterChange, scanFilter]);

  useEffect(() => () => onScanFilterChange?.(''), [onScanFilterChange]);

  useLayoutEffect(() => {
    if (!isSettingsOpen) {
      return;
    }

    function updateSettingsPanelPosition() {
      const button = settingsButtonRef.current;
      if (!button) {
        return;
      }
      const buttonRect = button.getBoundingClientRect();
      const width = Math.min(
        SETTINGS_PANEL_WIDTH,
        window.innerWidth - SETTINGS_PANEL_MARGIN * 2,
      );
      const left = Math.min(
        Math.max(
          SETTINGS_PANEL_MARGIN,
          buttonRect.right - width,
        ),
        window.innerWidth - width - SETTINGS_PANEL_MARGIN,
      );
      const belowTop = buttonRect.bottom + SETTINGS_PANEL_MARGIN;
      const availableBelow =
        window.innerHeight - belowTop - SETTINGS_PANEL_MARGIN;
      const availableAbove =
        buttonRect.top - SETTINGS_PANEL_MARGIN * 2;

      if (
        availableBelow < SETTINGS_PANEL_MIN_HEIGHT &&
        availableAbove > availableBelow
      ) {
        setSettingsPanelStyle({
          bottom:
            window.innerHeight - buttonRect.top + SETTINGS_PANEL_MARGIN,
          left,
          maxHeight: Math.max(SETTINGS_PANEL_MIN_HEIGHT, availableAbove),
          width,
        });
        return;
      }

      setSettingsPanelStyle({
        left,
        maxHeight: Math.max(SETTINGS_PANEL_MIN_HEIGHT, availableBelow),
        top: belowTop,
        width,
      });
    }

    updateSettingsPanelPosition();
    window.addEventListener('resize', updateSettingsPanelPosition);
    window.addEventListener('scroll', updateSettingsPanelPosition, true);
    return () => {
      window.removeEventListener('resize', updateSettingsPanelPosition);
      window.removeEventListener('scroll', updateSettingsPanelPosition, true);
    };
  }, [isSettingsOpen]);

  function getInitialView() {
    if (!viewer) {
      return null;
    }
    initialViewRef.current ??= {
      zoom: viewer.viewport.getZoom(),
      center: viewer.viewport.getCenter(),
    };
    return initialViewRef.current;
  }

  function setViewerZoomPercent(value: number) {
    const requestedZoomPercent = Math.min(
      Math.max(value, MIN_ZOOM_PERCENT),
      MAX_ZOOM_PERCENT,
    );
    if (viewer) {
      const { viewport } = viewer;
      const initialView = getInitialView();
      const baseZoom = initialView?.zoom ?? viewport.getZoom();
      viewport.zoomTo(
        baseZoom * (requestedZoomPercent / 100),
        undefined,
        true,
      );
      viewport.applyConstraints(true);
      const actualZoomPercent = Math.round(
        (viewport.getZoom() / baseZoom) * 100,
      );
      setZoomPercent(actualZoomPercent);
      return actualZoomPercent;
    }
    setZoomPercent(requestedZoomPercent);
    return requestedZoomPercent;
  }

  function applyZoomPercent(value: number) {
    const nextZoomPercent = setViewerZoomPercent(value);
    setZoomInput(null);
    return nextZoomPercent;
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
    setZoomInput(nextValue);
  }

  function handleZoomIn() {
    applyZoomPercent(zoomPercent + 10);
  }

  function handleZoomOut() {
    applyZoomPercent(zoomPercent - 10);
  }

  function handleResetView() {
    setBrightness(DEFAULT_SCAN_FILTER_VALUE);
    setContrast(DEFAULT_SCAN_FILTER_VALUE);
    setSaturation(DEFAULT_SCAN_FILTER_VALUE);
    setIsInverted(false);

    if (viewer) {
      const { viewport } = viewer;
      const initialView = getInitialView();

      // Force-reset all mutable viewport state for lazy/virtualized manifests.
      if (viewport.getRotation() !== 0) {
        viewport.setRotation(0);
      }
      if (initialView) {
        viewport.zoomTo(initialView.zoom, undefined, true);
        viewport.panTo(initialView.center, true);
      } else {
        const homeBounds: Rect = viewport.getHomeBounds();
        viewport.fitBounds(homeBounds, true);
        viewport.panTo(homeBounds.getCenter(), true);
      }
      viewport.applyConstraints(true);
      setZoomPercent(100);
    } else {
      home();
      if (rotation !== 0) {
        rotate(-rotation);
      }
      setZoomPercent(100);
    }
    setZoomInput(null);
  }

  return (
    <>
      <div className="gds-document-detail-scan-toolbar__zoom-segment">
        <DocumentDetailToolButton
          aria-label="Zoom out"
          className="gds-document-detail-scan-toolbar__button"
          icon={
            <IconZoomOut className="gds-document-detail-scan-toolbar__icon" />
          }
          onPress={handleZoomOut}
          size="compact"
        />
        <label className="gds-document-detail-scan-toolbar__zoom-field">
          <input
            aria-label="Scan zoom percentage, 10 to 400"
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
          aria-label="Zoom in"
          className="gds-document-detail-scan-toolbar__button"
          icon={
            <IconZoomIn className="gds-document-detail-scan-toolbar__icon" />
          }
          onPress={handleZoomIn}
          size="compact"
        />
      </div>
      <span
        className="gds-document-detail-scan-toolbar__divider"
        aria-hidden="true"
      />
      <DocumentDetailToolButton
        aria-label="Reset scan view"
        className="gds-document-detail-scan-toolbar__button"
        icon={<IconReset className="gds-document-detail-scan-toolbar__icon" />}
        onPress={handleResetView}
        size="compact"
      />
      <DocumentDetailToolButton
        aria-label="Rotate scan"
        className="gds-document-detail-scan-toolbar__button"
        icon={<IconRotate className="gds-document-detail-scan-toolbar__icon" />}
        onPress={() => {
          rotate(90);
        }}
        size="compact"
      />
      <div className="gds-document-detail-scan-toolbar__settings">
        <DocumentDetailToolButton
          ref={settingsButtonRef}
          aria-label="Scan image settings"
          aria-controls={settingsPanelId}
          aria-expanded={isSettingsOpen}
          className="gds-document-detail-scan-toolbar__button"
          icon={
            <IconSetting className="gds-document-detail-scan-toolbar__icon" />
          }
          isActive={isSettingsOpen}
          onPress={() => {
            if (isSettingsOpen) {
              setSettingsPanelStyle(null);
            }
            setIsSettingsOpen((open) => !open);
          }}
          size="compact"
        />
      </div>
      {isSettingsOpen && settingsPanelStyle && createPortal(
        <div
          id={settingsPanelId}
          className="gds-document-detail-scan-toolbar__settings-panel"
          role="dialog"
          aria-label="Scan image settings"
          style={settingsPanelStyle}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setSettingsPanelStyle(null);
              setIsSettingsOpen(false);
              settingsButtonRef.current?.focus();
            }
          }}
        >
          <div className="gds-document-detail-scan-toolbar__settings-row">
            <div className="gds-document-detail-scan-toolbar__settings-label">
              <IconBrightness className="gds-document-detail-scan-toolbar__settings-icon" />
              <span>Brightness</span>
            </div>
            <input
              aria-label="Brightness"
              className="gds-document-detail-scan-toolbar__settings-slider"
              type="range"
              min={50}
              max={150}
              step={1}
              value={brightness}
              style={getSliderFillStyle(brightness, 50, 150)}
              onInput={(event) => {
                setBrightness(Number(event.currentTarget.value));
              }}
              onChange={(event) => {
                setBrightness(Number(event.currentTarget.value));
              }}
            />
            <span className="gds-document-detail-scan-toolbar__settings-value">
              {brightness}%
            </span>
          </div>
          <div className="gds-document-detail-scan-toolbar__settings-row">
            <div className="gds-document-detail-scan-toolbar__settings-label">
              <IconContrast className="gds-document-detail-scan-toolbar__settings-icon" />
              <span>Contrast</span>
            </div>
            <input
              aria-label="Contrast"
              className="gds-document-detail-scan-toolbar__settings-slider"
              type="range"
              min={50}
              max={150}
              step={1}
              value={contrast}
              style={getSliderFillStyle(contrast, 50, 150)}
              onInput={(event) => {
                setContrast(Number(event.currentTarget.value));
              }}
              onChange={(event) => {
                setContrast(Number(event.currentTarget.value));
              }}
            />
            <span className="gds-document-detail-scan-toolbar__settings-value">
              {contrast}%
            </span>
          </div>
          <div className="gds-document-detail-scan-toolbar__settings-row">
            <div className="gds-document-detail-scan-toolbar__settings-label">
              <IconSaturation className="gds-document-detail-scan-toolbar__settings-icon" />
              <span>Saturation</span>
            </div>
            <input
              aria-label="Saturation"
              className="gds-document-detail-scan-toolbar__settings-slider"
              type="range"
              min={0}
              max={200}
              step={1}
              value={saturation}
              style={getSliderFillStyle(saturation, 0, 200)}
              onInput={(event) => {
                setSaturation(Number(event.currentTarget.value));
              }}
              onChange={(event) => {
                setSaturation(Number(event.currentTarget.value));
              }}
            />
            <span className="gds-document-detail-scan-toolbar__settings-value">
              {saturation}%
            </span>
          </div>
          <div className="gds-document-detail-scan-toolbar__settings-row gds-document-detail-scan-toolbar__settings-row--invert">
            <div className="gds-document-detail-scan-toolbar__settings-label">
              <IconInvert className="gds-document-detail-scan-toolbar__settings-icon" />
              <span>Invert</span>
            </div>
            <label className="gds-document-detail-scan-toolbar__settings-checkbox">
              <input
                type="checkbox"
                checked={isInverted}
                onChange={(event) => {
                  setIsInverted(event.currentTarget.checked);
                }}
              />
              <span>Invert scan image</span>
            </label>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
