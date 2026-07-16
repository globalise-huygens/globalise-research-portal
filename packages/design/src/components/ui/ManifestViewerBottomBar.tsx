import {
  ViewerBarGroup,
  ViewerBottomBar as ViewerBottomBarPrimitive,
} from './ViewerLayout';
import { ManifestViewerIconButton } from './ManifestViewerControls';
import {
  IconClose,
  IconLeft,
  IconLeftFirst,
  IconRight,
  IconRightLast,
} from '../icons';
import type { ManifestViewerScan } from './ManifestViewerTypes';

export function ManifestViewerBottomBar({
  currentScan,
  documentScanTotal,
  searchHit,
  searchHitTotal,
  isSearchNavigationVisible,
  onFirstScan,
  onPreviousScan,
  onNextScan,
  onLastScan,
  onPreviousSearchHit,
  onNextSearchHit,
  onClearSearchHits,
}: {
  currentScan: ManifestViewerScan;
  documentScanTotal: number;
  searchHit: number;
  searchHitTotal: number;
  isSearchNavigationVisible: boolean;
  onFirstScan: () => void;
  onPreviousScan: () => void;
  onNextScan: () => void;
  onLastScan: () => void;
  onPreviousSearchHit: () => void;
  onNextSearchHit: () => void;
  onClearSearchHits: () => void;
}) {
  return (
    <ViewerBottomBarPrimitive className="manifest-viewer-bottom-bar">
      <ViewerBarGroup>
        <ManifestViewerIconButton
          aria-label="First scan"
          tooltip="Go to first scan"
          icon={<IconLeftFirst className="manifest-viewer-icon" />}
          onPress={onFirstScan}
          variant="quiet"
        />
        <ManifestViewerIconButton
          aria-label="Previous scan"
          tooltip="Go to previous scan"
          icon={<IconLeft className="manifest-viewer-icon" />}
          onPress={onPreviousScan}
          variant="quiet"
        />
        <span>Scan {currentScan.archiveScan}</span>
        <span className="manifest-viewer-muted">|</span>
        <span>in doc.</span>
        <strong>{currentScan.documentScan}</strong>
        <span>of {documentScanTotal}</span>
        <ManifestViewerIconButton
          aria-label="Next scan"
          tooltip="Go to next scan"
          icon={<IconRight className="manifest-viewer-icon" />}
          onPress={onNextScan}
          variant="quiet"
        />
        <ManifestViewerIconButton
          aria-label="Last scan"
          tooltip="Go to last scan"
          icon={<IconRightLast className="manifest-viewer-icon" />}
          onPress={onLastScan}
          variant="quiet"
        />
      </ViewerBarGroup>

      {isSearchNavigationVisible && (
        <ViewerBarGroup>
          <span className="manifest-viewer-muted">|</span>
          <ManifestViewerIconButton
            aria-label="Previous search hit"
            tooltip="Previous search hit"
            icon={<IconLeft className="manifest-viewer-icon" />}
            onPress={onPreviousSearchHit}
            variant="quiet"
          />
          <span>search hits</span>
          <strong>{searchHit}</strong>
          <span>of {searchHitTotal}</span>
          <ManifestViewerIconButton
            aria-label="Clear search hits"
            tooltip="Clear search hit navigation"
            icon={<IconClose className="manifest-viewer-icon" />}
            onPress={onClearSearchHits}
            variant="quiet"
          />
          <ManifestViewerIconButton
            aria-label="Next search hit"
            tooltip="Next search hit"
            icon={<IconRight className="manifest-viewer-icon" />}
            onPress={onNextSearchHit}
            variant="quiet"
          />
        </ViewerBarGroup>
      )}
    </ViewerBottomBarPrimitive>
  );
}
