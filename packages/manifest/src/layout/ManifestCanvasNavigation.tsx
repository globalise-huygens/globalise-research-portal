import {
  setSelectedCanvas,
  type CanvasId,
  useSelectedCanvas,
} from '@globalise/common/document';
import { IconLeftFirst, IconRightLast } from '@globalise/design';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { BOTTOM_BAR_BUTTON } from './buttonClasses.ts';
import { PrevNextInputBrowser } from './PrevNextInputBrowser.tsx';
import { TooltipIconButton } from './TooltipIconButton.tsx';

export function ManifestCanvasNavigation() {
  const { vault, id: manifestId, isReady } = useManifest();
  const { id: selectedCanvasId } = useSelectedCanvas();

  if (!isReady || !manifestId) {
    return null;
  }

  const { items: canvases } = vault.get({ id: manifestId, type: 'Manifest' });
  const selectedIndex = canvases.findIndex(({ id }) => id === selectedCanvasId);
  if (selectedIndex === -1) {
    return null;
  }

  const totalScans = canvases.length;
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < totalScans - 1;

  function selectCanvas(canvasId?: CanvasId) {
    if (canvasId) {
      setSelectedCanvas(canvasId, 'external');
    }
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
        onPress={() => selectCanvas(canvases[0]?.id)}
      />
      <PrevNextInputBrowser
        label="Scan"
        name="scan"
        index={selectedIndex}
        total={totalScans}
        onSelect={(index) => selectCanvas(canvases[index]?.id)}
      />
      <TooltipIconButton
        aria-label="Last scan"
        tooltip="Go to last scan"
        tooltipPlacement="top"
        isDisabled={!hasNext}
        className={BOTTOM_BAR_BUTTON}
        icon={<IconRightLast className="h-s16 w-s16" />}
        onPress={() => selectCanvas(canvases[totalScans - 1]?.id)}
      />
    </div>
  );
}
