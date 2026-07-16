import './Legacy.css';
import * as React from 'react';
import {
  ViewerBody,
  SplitViewer,
} from '../Layout';
import { ManifestViewerOverlay } from './Overlay';
import { ManifestViewerBottomBar } from './BottomBar';
import {
  CollapsedMetadataRail,
  MetadataSidebar,
} from './Sidebar';
import { ManifestViewerTopBar } from './TopBar';
import type {
  ManifestViewerContent,
  ManifestViewerPaneKey,
  ManifestViewerScan,
  ManifestViewerScanRenderer,
  ManifestViewerSidebarSectionId,
} from './Types';
import {
  ManuscriptPane,
  type TranscriptMode,
  TranscriptPane,
} from './Panes';

export type ManifestViewerProps = {
  content: ManifestViewerContent;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  renderScanPage?: ManifestViewerScanRenderer;
  renderScanThumbnail?: ManifestViewerScanRenderer;
};

function getInitialScan(content: ManifestViewerContent) {
  const scans = getAllScans(content);

  return (
    scans.find(
      (scan) => scan.archiveScan === content.currentScan.archiveScan,
    ) ?? scans[0]
  );
}

function getAllScans(content: ManifestViewerContent) {
  if (content.tableOfContentsDocuments?.length) {
    return content.tableOfContentsDocuments.flatMap((document) =>
      document.scans.map((scan) => ({
        ...scan,
        documentId: scan.documentId ?? document.id,
        documentTitle: scan.documentTitle ?? document.title,
      })),
    );
  }

  return content.tableOfContents;
}

function getScanAtOffset(
  scans: ManifestViewerScan[],
  currentScan: ManifestViewerScan,
  offset: number,
) {
  const currentIndex = scans.findIndex(
    (scan) => scan.archiveScan === currentScan.archiveScan,
  );
  const nextIndex = Math.min(
    Math.max((currentIndex >= 0 ? currentIndex : 0) + offset, 0),
    scans.length - 1,
  );

  return scans[nextIndex] ?? currentScan;
}

function getDocumentScanTotal(
  content: ManifestViewerContent,
  currentScan: ManifestViewerScan,
) {
  const currentDocument = content.tableOfContentsDocuments?.find((document) =>
    document.scans.some((scan) => scan.archiveScan === currentScan.archiveScan),
  );

  return currentDocument?.scans.length ?? content.currentScan.documentScanTotal;
}

function renderDefaultScanPage({
  className,
  label,
}: Parameters<ManifestViewerScanRenderer>[0]) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`manifest-viewer-scan-page${className ? ` ${className}` : ''}`}
    >
      <span>{label}</span>
    </div>
  );
}

export function ManifestViewer({
  content,
  isOpen,
  onOpenChange,
  renderScanPage,
  renderScanThumbnail,
}: ManifestViewerProps) {
  const [isWarningOpen, setIsWarningOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isScanVisible, setIsScanVisible] = React.useState(true);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
  const [isViewerOrderSwapped, setIsViewerOrderSwapped] = React.useState(false);
  const [isPairedPageView, setIsPairedPageView] = React.useState(false);
  const [isMiniWindowEnabled, setIsMiniWindowEnabled] = React.useState(false);
  const [transcriptMode, setTranscriptMode] =
    React.useState<TranscriptMode>('normalised');
  const [currentScan, setCurrentScan] = React.useState(() =>
    getInitialScan(content),
  );
  const [currentSearchHit, setCurrentSearchHit] = React.useState(
    content.searchHits.current,
  );
  const [isSearchNavigationVisible, setIsSearchNavigationVisible] =
    React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState<
    Record<ManifestViewerSidebarSectionId, boolean>
  >({
    inventory: true,
    contents: false,
    entities: false,
    events: false,
  });
  const [lastOpenedSection, setLastOpenedSection] =
    React.useState<ManifestViewerSidebarSectionId>('inventory');
  const allScans = React.useMemo(() => getAllScans(content), [content]);
  const collapsedRailActiveSection = lastOpenedSection;
  const documentScanTotal = getDocumentScanTotal(content, currentScan);
  const resolvedRenderScanPage = renderScanPage ?? renderDefaultScanPage;
  const resolvedRenderScanThumbnail =
    renderScanThumbnail ?? renderScanPage ?? renderDefaultScanPage;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentScan(getInitialScan(content));
    setCurrentSearchHit(content.searchHits.current);
    setIsSearchNavigationVisible(true);
  }, [content]);

  const setSectionExpanded = (
    section: ManifestViewerSidebarSectionId,
    isExpanded: boolean,
  ) => {
    if (isExpanded) {
      setLastOpenedSection(section);
    }

    setExpandedSections((current) => ({ ...current, [section]: isExpanded }));
  };

  const expandSidebar = (section?: ManifestViewerSidebarSectionId) => {
    setIsSidebarOpen(true);

    if (section) {
      setLastOpenedSection(section);
      setSectionExpanded(section, true);
    }
  };

  const togglePane = (pane: ManifestViewerPaneKey) => {
    if (pane === 'scan') {
      setIsScanVisible((current) =>
        current && !isTextVisible ? current : !current,
      );
      return;
    }

    setIsTextVisible((current) =>
      current && !isScanVisible ? current : !current,
    );
  };

  const navigateScan = (offset: number) => {
    setCurrentScan((scan) => getScanAtOffset(allScans, scan, offset));
  };

  const navigateSearchHit = (offset: number) => {
    setCurrentSearchHit((hit) => {
      const next = hit + offset;

      if (next < 1) {
        return content.searchHits.total;
      }

      if (next > content.searchHits.total) {
        return 1;
      }

      return next;
    });
  };

  const panes = [
    <ManuscriptPane
      key="scan"
      currentScan={currentScan}
      isVisible={isScanVisible}
      renderScanPage={resolvedRenderScanPage}
      showMiniTranscript={isMiniWindowEnabled && isTextVisible}
    />,
    <TranscriptPane
      key="text"
      currentScan={currentScan}
      isVisible={isTextVisible}
      lines={content.transcriptLines}
      renderScanPage={resolvedRenderScanPage}
      transcriptMode={transcriptMode}
      onTranscriptModeChange={setTranscriptMode}
      showMiniScan={isMiniWindowEnabled && isScanVisible}
    />,
  ];

  return (
    <ManifestViewerOverlay
      ariaLabel={`${content.inventory.title}: ${content.metadata.titles}`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      contentClassName="slot-full-bleed"
      dialogClassName={
        isSidebarOpen
          ? 'manifest-viewer-dialog--sidebar-open'
          : 'manifest-viewer-dialog--sidebar-collapsed'
      }
    >
      {isSidebarOpen ? (
        <MetadataSidebar
          content={content}
          currentArchiveScan={currentScan.archiveScan}
          expandedSections={expandedSections}
          renderScanThumbnail={resolvedRenderScanThumbnail}
          onSectionChange={setSectionExpanded}
          onSelectScan={setCurrentScan}
        />
      ) : null}

      {!isSidebarOpen ? (
        <CollapsedMetadataRail
          content={content}
          onExpand={expandSidebar}
          activeSection={collapsedRailActiveSection}
        />
      ) : null}

      <ManifestViewerTopBar
        content={content}
        isSidebarOpen={isSidebarOpen}
        isScanVisible={isScanVisible}
        isTextVisible={isTextVisible}
        isWarningOpen={isWarningOpen}
        isViewerOrderSwapped={isViewerOrderSwapped}
        isPairedPageView={isPairedPageView}
        isMiniWindowEnabled={isMiniWindowEnabled}
        onSidebarToggle={() => setIsSidebarOpen((current) => !current)}
        onPaneToggle={togglePane}
        onWarningOpenChange={setIsWarningOpen}
        onViewerOrderToggle={() =>
          setIsViewerOrderSwapped((current) => !current)
        }
        onPairedPageToggle={() => setIsPairedPageView((current) => !current)}
        onMiniWindowToggle={() => setIsMiniWindowEnabled((current) => !current)}
        onClose={() => onOpenChange(false)}
      />

      <ViewerBody
        className={`manifest-viewer-body${
          isSidebarOpen
            ? ' manifest-viewer-body--sidebar-open'
            : ''
        }`}
      >
        <SplitViewer
          className="manifest-viewer-split-viewer"
          data-layout={
            isScanVisible && isTextVisible
              ? 'split'
              : isScanVisible
                ? 'scan'
                : 'text'
          }
          data-order={isViewerOrderSwapped ? 'text-first' : 'scan-first'}
          data-paired-page={isPairedPageView ? 'true' : 'false'}
        >
          {isViewerOrderSwapped ? [...panes].reverse() : panes}
        </SplitViewer>
      </ViewerBody>

      <ManifestViewerBottomBar
        currentScan={currentScan}
        documentScanTotal={documentScanTotal}
        searchHit={currentSearchHit}
        searchHitTotal={content.searchHits.total}
        isSearchNavigationVisible={isSearchNavigationVisible}
        onFirstScan={() => setCurrentScan(allScans[0])}
        onPreviousScan={() => navigateScan(-1)}
        onNextScan={() => navigateScan(1)}
        onLastScan={() => setCurrentScan(allScans[allScans.length - 1])}
        onPreviousSearchHit={() => navigateSearchHit(-1)}
        onNextSearchHit={() => navigateSearchHit(1)}
        onClearSearchHits={() => setIsSearchNavigationVisible(false)}
      />
    </ManifestViewerOverlay>
  );
}
