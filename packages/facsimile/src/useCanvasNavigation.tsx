import {useCanvas, useViewerReady} from '@knaw-huc/osd-iiif-viewer';
import {useManifest} from '@knaw-huc/osd-iiif-viewer';
import {getValue} from '@iiif/helpers/i18n';

export function useCanvasNavigation() {
  const {isReady: isManifestReady} = useManifest();
  const isViewerReady = useViewerReady();
  const {currentIndex, current, total, next, prev, goTo} = useCanvas();

  const isReady = isManifestReady && !!current;

  const goToRandom = () => goTo(Math.floor(Math.random() * total));

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < total - 1;
  const label = current ? getValue(current.label) : null;
  const position = `(${currentIndex + 1}/${total})`;

  return {
    isReady,
    isViewerReady,
    isManifestReady,
    prev,
    next,
    goToRandom,
    label,
    position,
    hasPrev,
    hasNext,
  };
}