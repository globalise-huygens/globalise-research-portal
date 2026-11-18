import { clamp } from '@globalise/common';
import {
  setSelectedCanvas,
  type CanvasId,
  useSelectedCanvas,
} from '@globalise/common/document';
import {
  IconLeft,
  IconLeftFirst,
  IconRight,
  IconRightLast,
} from '@globalise/design';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { useState } from 'react';
import { BOTTOM_BAR_BUTTON } from './buttonClasses.ts';
import { TooltipIconButton } from './TooltipIconButton.tsx';

export function ManifestCanvasNavigation() {
  const { vault, id: manifestId, isReady } = useManifest();
  const { id: selectedCanvasId } = useSelectedCanvas();
  const [scanInput, setScanInput] = useState<string | null>(null);

  if (!isReady || !manifestId) {
    return null;
  }

  const { items: canvases } = vault.get({ id: manifestId, type: 'Manifest' });
  const selectedIndex = canvases.findIndex(({ id }) => id === selectedCanvasId);
  if (selectedIndex === -1) {
    return null;
  }

  const currentScanNumber = selectedIndex + 1;
  const totalScans = canvases.length;
  const scanInputValue = scanInput ?? String(currentScanNumber);
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < totalScans - 1;
  const firstId = canvases[0]?.id;
  const prevId = canvases[selectedIndex - 1]?.id;
  const nextId = canvases[selectedIndex + 1]?.id;
  const lastId = canvases[totalScans - 1]?.id;

  function scrollTo(canvasId?: CanvasId) {
    if (!canvasId) {
      return;
    }
    setScanInput(null);
    setSelectedCanvas(canvasId, 'external');
  }

  function navigateToScanNumber(scanNumber: number) {
    const nextScanNumber = clamp(scanNumber, 1, totalScans);
    const nextCanvasId = canvases[nextScanNumber - 1]?.id;
    scrollTo(nextCanvasId);
  }

  function commitScanInput() {
    const parsed = Number.parseInt(scanInputValue, 10);
    if (Number.isNaN(parsed)) {
      setScanInput(null);
      return;
    }
    navigateToScanNumber(parsed);
  }

  function handleScanInputChange(value: string) {
    setScanInput(
      value.replace(/[^\d]/g, '').slice(0, String(totalScans).length),
    );
  }

  return (
    <div className="bar-group">
      <TooltipIconButton
        aria-label="First scan"
        tooltip="Go to first scan"
        tooltipPlacement="top"
        isDisabled={!hasPrev}
        className={BOTTOM_BAR_BUTTON}
        icon={<IconLeftFirst className="h-s16 w-s16" />}
        onPress={() => scrollTo(firstId)}
      />
      <TooltipIconButton
        aria-label="Previous scan"
        tooltip="Go to previous scan"
        tooltipPlacement="top"
        isDisabled={!hasPrev}
        className={BOTTOM_BAR_BUTTON}
        icon={<IconLeft className="h-s16 w-s16" />}
        onPress={() => scrollTo(prevId)}
      />

      <span className="scan-position">
        <span>Scan</span>
        <input
          aria-label={`Current scan number, 1 to ${totalScans}`}
          className="scan-position-input"
          inputMode="numeric"
          maxLength={String(totalScans).length}
          pattern="[0-9]*"
          style={{ width: `${Math.max(2, String(totalScans).length)}ch` }}
          type="text"
          value={scanInputValue}
          onBlur={commitScanInput}
          onChange={(event) => {
            handleScanInputChange(event.currentTarget.value);
          }}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitScanInput();
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setScanInput(null);
              event.currentTarget.blur();
            }
          }}
        />
        <span>of {totalScans}</span>
      </span>

      <TooltipIconButton
        aria-label="Next scan"
        tooltip="Go to next scan"
        tooltipPlacement="top"
        isDisabled={!hasNext}
        className={BOTTOM_BAR_BUTTON}
        icon={<IconRight className="h-s16 w-s16" />}
        onPress={() => scrollTo(nextId)}
      />
      <TooltipIconButton
        aria-label="Last scan"
        tooltip="Go to last scan"
        tooltipPlacement="top"
        isDisabled={!hasNext}
        className={BOTTOM_BAR_BUTTON}
        icon={<IconRightLast className="h-s16 w-s16" />}
        onPress={() => scrollTo(lastId)}
      />
    </div>
  );
}
