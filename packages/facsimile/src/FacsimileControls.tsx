import {
  IconBrightness,
  IconContrast,
  IconInvert,
  IconReset,
  IconRotate,
  IconSaturation,
  IconSetting,
  IconZoomIn,
  IconZoomOut,
  ToolButton,
} from '@globalise/design';
import { useViewer, useViewerControls } from '@knaw-huc/osd-iiif-viewer';
import { type Point, type Rect } from 'openseadragon';
import {
  type CSSProperties,
  type RefObject,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import './ScanSettings.css';

type FacsimileControlsProps = {
  fullscreenRef: RefObject<HTMLDivElement | null>;
  onScanFilterChange?: (filter: string) => void;
};

const MIN_ZOOM_PERCENT = 10;
const MAX_ZOOM_PERCENT = 400;
const DEFAULT_SCAN_FILTER_VALUE = 100;
const SETTINGS_PANEL_WIDTH = 220;
const SETTINGS_PANEL_MARGIN = 12;
const SETTINGS_PANEL_GAP = 8;
const SETTINGS_PANEL_MIN_HEIGHT = 140;

type ScanSetting = {
  icon: ReactNode;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
};

type InitialView = {
  center: Point;
  zoom: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSliderFillStyle(value: number, min: number, max: number) {
  const percent = ((value - min) / (max - min)) * 100;

  return {
    ['--slider-fill' as string]: `${percent}%`,
  };
}

function getSettingsPanelStyle(buttonRect: DOMRect): CSSProperties {
  const width = Math.min(
    SETTINGS_PANEL_WIDTH,
    window.innerWidth - SETTINGS_PANEL_MARGIN * 2,
  );
  const left = clamp(
    buttonRect.left + buttonRect.width / 2 - width / 2,
    SETTINGS_PANEL_MARGIN,
    window.innerWidth - width - SETTINGS_PANEL_MARGIN,
  );
  const belowTop = buttonRect.bottom + SETTINGS_PANEL_GAP;
  const availableBelow =
    window.innerHeight - belowTop - SETTINGS_PANEL_MARGIN;
  const availableAbove =
    buttonRect.top - SETTINGS_PANEL_GAP - SETTINGS_PANEL_MARGIN;

  if (
    availableBelow < SETTINGS_PANEL_MIN_HEIGHT &&
    availableAbove > availableBelow
  ) {
    return {
      bottom: window.innerHeight - buttonRect.top + SETTINGS_PANEL_GAP,
      left,
      maxHeight: Math.max(SETTINGS_PANEL_MIN_HEIGHT, availableAbove),
      width,
    };
  }

  return {
    left,
    maxHeight: Math.max(SETTINGS_PANEL_MIN_HEIGHT, availableBelow),
    top: belowTop,
    width,
  };
}

export function FacsimileControls({
  fullscreenRef,
  onScanFilterChange,
}: FacsimileControlsProps) {
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
  const initialViewRef = useRef<InitialView | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const settingsPanelId = useId();

  const zoomInputValue = zoomInput ?? String(zoomPercent);
  const scanFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) invert(${isInverted ? 1 : 0})`;

  const getInitialView = useCallback((): InitialView | null => {
    if (!viewer) {
      return null;
    }
    initialViewRef.current ??= {
      zoom: viewer.viewport.getZoom(),
      center: viewer.viewport.getCenter(),
    };
    return initialViewRef.current;
  }, [viewer]);

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
    if (!viewer) {
      return;
    }

    let frameId: number | null = null;
    const updateZoomPercent = () => {
      if (frameId !== null) {
        return;
      }
      frameId = requestAnimationFrame(() => {
        frameId = null;
        const initialView = getInitialView();
        if (!initialView) {
          return;
        }
        setZoomPercent(Math.round(
          (viewer.viewport.getZoom() / initialView.zoom) * 100,
        ));
      });
    };

    viewer.addHandler('zoom', updateZoomPercent);
    viewer.addHandler('viewport-change', updateZoomPercent);
    viewer.addHandler('animation', updateZoomPercent);
    updateZoomPercent();

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      viewer.removeHandler('zoom', updateZoomPercent);
      viewer.removeHandler('viewport-change', updateZoomPercent);
      viewer.removeHandler('animation', updateZoomPercent);
    };
  }, [getInitialView, viewer]);

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
      setSettingsPanelStyle(
        getSettingsPanelStyle(button.getBoundingClientRect()),
      );
    }

    updateSettingsPanelPosition();
    window.addEventListener('resize', updateSettingsPanelPosition);
    window.addEventListener('scroll', updateSettingsPanelPosition, true);
    return () => {
      window.removeEventListener('resize', updateSettingsPanelPosition);
      window.removeEventListener('scroll', updateSettingsPanelPosition, true);
    };
  }, [isSettingsOpen]);

  function setViewerZoomPercent(value: number) {
    const requestedZoomPercent = clamp(
      value,
      MIN_ZOOM_PERCENT,
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

  const scanSettings: ScanSetting[] = [
    {
      icon: <IconBrightness />,
      label: 'Brightness',
      max: 150,
      min: 50,
      onChange: setBrightness,
      value: brightness,
    },
    {
      icon: <IconContrast />,
      label: 'Contrast',
      max: 150,
      min: 50,
      onChange: setContrast,
      value: contrast,
    },
    {
      icon: <IconSaturation />,
      label: 'Saturation',
      max: 200,
      min: 0,
      onChange: setSaturation,
      value: saturation,
    },
  ];

  return (
    <>
      <div className="zoom-controls">
        <ToolButton
          aria-label="Zoom out"
          icon={
            <IconZoomOut />
          }
          onPress={handleZoomOut}
          size="compact"
        />
        <label className="zoom-field">
          <input
            aria-label="Scan zoom percentage, 10 to 400"
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
          aria-label="Zoom in"
          icon={
            <IconZoomIn />
          }
          onPress={handleZoomIn}
          size="compact"
        />
      </div>
      <span
        className="toolbar-divider"
        aria-hidden="true"
      />
      <ToolButton
        aria-label="Reset scan view"
        icon={<IconReset />}
        onPress={handleResetView}
        size="compact"
      />
      <ToolButton
        aria-label="Rotate scan"
        icon={<IconRotate />}
        onPress={() => {
          rotate(90);
        }}
        size="compact"
      />
      <ToolButton
        ref={settingsButtonRef}
        aria-label="Scan image settings"
        aria-controls={settingsPanelId}
        aria-expanded={isSettingsOpen}
        icon={<IconSetting />}
        isActive={isSettingsOpen}
        onPress={() => {
          if (isSettingsOpen) {
            setSettingsPanelStyle(null);
          }
          setIsSettingsOpen((open) => !open);
        }}
        size="compact"
      />
      {isSettingsOpen && settingsPanelStyle && createPortal(
        <div
          id={settingsPanelId}
          className="scan-settings"
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
          {scanSettings.map((setting) => (
            <ScanSettingSlider key={setting.label} {...setting} />
          ))}
          <div className="row" data-layout="checkbox">
            <SettingIcon label="Invert">
              <IconInvert />
            </SettingIcon>
            <input
              aria-label="Invert scan image"
              className="checkbox"
              type="checkbox"
              checked={isInverted}
              onChange={(event) => {
                setIsInverted(event.currentTarget.checked);
              }}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function ScanSettingSlider({
  icon,
  label,
  max,
  min,
  onChange,
  value,
}: ScanSetting) {
  function handleChange(nextValue: string) {
    onChange(Number(nextValue));
  }

  return (
    <div className="row">
      <SettingIcon label={label}>
        {icon}
      </SettingIcon>
      <input
        aria-label={label}
        className="slider"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        style={getSliderFillStyle(value, min, max)}
        onInput={(event) => {
          handleChange(event.currentTarget.value);
        }}
        onChange={(event) => {
          handleChange(event.currentTarget.value);
        }}
      />
      <span className="value">
        {value}%
      </span>
    </div>
  );
}

function SettingIcon(
  { children, label }: { children: ReactNode; label: string },
) {
  return (
    <span className="icon">
      {children}
      <span aria-hidden="true" className="tooltip">{label}</span>
    </span>
  );
}
