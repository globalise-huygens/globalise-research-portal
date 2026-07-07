import { type CanvasId, useSelectedCanvas } from '@globalise/common/document';
import {
  DocumentDetailBarGroup,
  IconLeft,
  IconLeftFirst,
  IconRight,
  IconRightLast,
} from '@globalise/design';
import { getValue } from '@iiif/helpers/i18n';
import { useManifest, useViewer } from '@knaw-huc/osd-iiif-viewer';
import { Point } from 'openseadragon';
import { lazyCollectionViewerStore } from '../facsimile/LazyCollectionViewerStore.ts';
import { BOTTOM_BAR_BUTTON } from './buttonClasses.ts';
import { TooltipIconButton } from './TooltipIconButton.tsx';

export function ManifestCanvasNavigation() {
  const viewer = useViewer();
  const { vault } = useManifest();
  const lazyCanvases = lazyCollectionViewerStore((s) => s.lazyCanvases);
  const { id: selectedCanvasId } = useSelectedCanvas();
  const selectedIndex = lazyCanvases.findIndex(
    (c) => c.canvasId === selectedCanvasId,
  );

  if (!lazyCanvases.length || selectedIndex === -1) {
    return null;
  }

  const canvas = vault
    ? vault.get({ id: lazyCanvases[selectedIndex].canvasId, type: 'Canvas' })
    : null;
  const label = canvas ? getValue(canvas.label) : `Scan ${selectedIndex + 1}`;

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < lazyCanvases.length - 1;
  const firstId = lazyCanvases[0]?.canvasId;
  const prevId = lazyCanvases[selectedIndex - 1]?.canvasId;
  const nextId = lazyCanvases[selectedIndex + 1]?.canvasId;
  const lastId = lazyCanvases[lazyCanvases.length - 1]?.canvasId;

  function scrollTo(canvasId?: CanvasId) {
    if (!viewer || !canvasId) {
      return;
    }
    const canvas = lazyCanvases.find((c) => c.canvasId === canvasId);
    if (!canvas) {
      return;
    }
    viewer.viewport.panTo(new Point(0.5, canvas.y + canvas.height / 2));
  }

  return (
    <DocumentDetailBarGroup className="gap-s8">
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

      <span className="min-w-0 inline-flex items-baseline gap-s8 leading-4 text-xs text-neutral-300">
        {label} ({selectedIndex + 1}/{lazyCanvases.length})
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
    </DocumentDetailBarGroup>
  );
}
