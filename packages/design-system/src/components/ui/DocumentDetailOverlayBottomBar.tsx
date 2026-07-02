import {
  DocumentDetailBarGroup,
  DocumentDetailBottomBar as DocumentDetailBottomBarPrimitive,
} from './DocumentDetailLayout';
import { DocumentDetailIconButton } from './DocumentDetailControls';
import {
  IconClose,
  IconLeft,
  IconLeftFirst,
  IconRight,
  IconRightLast,
} from '@/index';
import type { DocumentDetailOverlayScan } from './DocumentDetailOverlayTypes';

export function DocumentDetailBottomBar({
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
  currentScan: DocumentDetailOverlayScan;
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
    <DocumentDetailBottomBarPrimitive className="document-detail-overlay-rich-bottom-bar">
      <DocumentDetailBarGroup>
        <DocumentDetailIconButton
          aria-label="First scan"
          tooltip="Go to first scan"
          icon={<IconLeftFirst className="document-detail-overlay-icon" />}
          onPress={onFirstScan}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Previous scan"
          tooltip="Go to previous scan"
          icon={<IconLeft className="document-detail-overlay-icon" />}
          onPress={onPreviousScan}
          variant="quiet"
        />
        <span>Scan {currentScan.archiveScan}</span>
        <span className="document-detail-overlay-muted">|</span>
        <span>in doc.</span>
        <strong>{currentScan.documentScan}</strong>
        <span>of {documentScanTotal}</span>
        <DocumentDetailIconButton
          aria-label="Next scan"
          tooltip="Go to next scan"
          icon={<IconRight className="document-detail-overlay-icon" />}
          onPress={onNextScan}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Last scan"
          tooltip="Go to last scan"
          icon={<IconRightLast className="document-detail-overlay-icon" />}
          onPress={onLastScan}
          variant="quiet"
        />
      </DocumentDetailBarGroup>

      {isSearchNavigationVisible && (
        <DocumentDetailBarGroup>
          <span className="document-detail-overlay-muted">|</span>
          <DocumentDetailIconButton
            aria-label="Previous search hit"
            tooltip="Previous search hit"
            icon={<IconLeft className="document-detail-overlay-icon" />}
            onPress={onPreviousSearchHit}
            variant="quiet"
          />
          <span>search hits</span>
          <strong>{searchHit}</strong>
          <span>of {searchHitTotal}</span>
          <DocumentDetailIconButton
            aria-label="Clear search hits"
            tooltip="Clear search hit navigation"
            icon={<IconClose className="document-detail-overlay-icon" />}
            onPress={onClearSearchHits}
            variant="quiet"
          />
          <DocumentDetailIconButton
            aria-label="Next search hit"
            tooltip="Next search hit"
            icon={<IconRight className="document-detail-overlay-icon" />}
            onPress={onNextSearchHit}
            variant="quiet"
          />
        </DocumentDetailBarGroup>
      )}
    </DocumentDetailBottomBarPrimitive>
  );
}
