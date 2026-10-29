import {
  IconLeftPanelClose,
  IconLeftPanelOpen,
  IconScan,
  IconSwap,
  IconTranscription,
  Toggle,
  ToggleGroup,
  Tooltip,
} from '@globalise/design';
import * as React from 'react';
import type { ManifestLayoutProps } from '../layout/ManifestLayout';
import { TOP_BAR_BUTTON } from '../layout/buttonClasses';
import { CollapsedMetadataRail } from '../layout/CollapsedMetadataRail';
import { ExpandedMetadataSidebar } from '../layout/ExpandedMetadataSidebar';
import { ManifestCloseButton } from '../layout/ManifestCloseButton';
import { ManifestContentWarning } from '../layout/ManifestContentWarning';
import { ManifestError } from '../layout/ManifestError';
import { ManifestEntityHighlightMenu } from '../layout/ManifestEntityHighlightMenu';
import { ManifestLayoutElementsToggle } from '../layout/ManifestLayoutElementsToggle';
import { SplitPaneLayout } from '../layout/splitpane';
import { TooltipIconButton } from '../layout/TooltipIconButton';
import { ViewerPane } from './ViewerPane';

export function DesktopLayout({
  topLeft,
  topCenter,
  topRight,
  scan,
  transcription,
  bottom,
  error,
  onClose,
}: ManifestLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const [isScanVisible, setIsScanVisible] = React.useState(true);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
  const [isViewerOrderSwapped, setIsViewerOrderSwapped] =
    React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    () => new Set(['inventory']),
  );

  const toggleSidebarSection = React.useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const expandSidebarSection = React.useCallback((sectionId: string) => {
    setExpandedSections((prev) => new Set(prev).add(sectionId));
    setIsSidebarExpanded(true);
  }, []);

  const scanPane = isScanVisible ? (
    <ViewerPane type="scan" isBordered={isTextVisible}>
      {scan}
    </ViewerPane>
  ) : null;
  const transcriptionPane = isTextVisible ? (
    <ViewerPane type="transcription">{transcription}</ViewerPane>
  ) : null;

  const selectedKeys = new Array<string>();
  if (isScanVisible) {
    selectedKeys.push('scan');
  }
  if (isTextVisible) {
    selectedKeys.push('text');
  }
  const splitPanes: [React.ReactNode, React.ReactNode] = isViewerOrderSwapped
    ? [
      <ViewerPane key="transcription" type="transcription" isBordered>
        {transcription}
      </ViewerPane>,
      <ViewerPane key="scan" type="scan">{scan}</ViewerPane>,
    ]
    : [
      <ViewerPane key="scan" type="scan" isBordered>{scan}</ViewerPane>,
      <ViewerPane key="transcription" type="transcription">
        {transcription}
      </ViewerPane>,
    ];

  return (
    <div className="gds manifest-viewer" data-layout="desktop">
      <div
        className="frame"
        data-sidebar-expanded={isSidebarExpanded ? 'true' : 'false'}
      >
        <div
          id="document-detail-sidebar"
          className="sidebar"
          data-expanded={isSidebarExpanded ? 'true' : 'false'}
        >
          {isSidebarExpanded ? (
            <ExpandedMetadataSidebar
              expandedSections={expandedSections}
              onToggleSection={toggleSidebarSection}
            />
          ) : (
            <CollapsedMetadataRail onExpandSection={expandSidebarSection} />
          )}
        </div>

        <div className="main">
          <header className="top-bar">
            <div className="top-bar-group left">
              <TooltipIconButton
                aria-controls="document-detail-sidebar"
                aria-expanded={isSidebarExpanded}
                aria-label={
                  isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'
                }
                tooltip={isSidebarExpanded ? 'Hide sidebar' : 'Show sidebar'}
                isActive={isSidebarExpanded}
                className={TOP_BAR_BUTTON}
                icon={isSidebarExpanded
                  ? <IconLeftPanelClose aria-hidden="true" className="toolbar-icon" />
                  : <IconLeftPanelOpen aria-hidden="true" className="toolbar-icon" />}
                onPress={() => setIsSidebarExpanded((v) => !v)}
              />

              <span className="top-bar-divider">
                |
              </span>

              {topLeft}

              <ToggleGroup
                aria-label="Primary viewer mode controls"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                  const next = new Set(Array.from(keys).map(String));
                  if (next.size === 0) {
                    return;
                  }
                  setIsScanVisible(next.has('scan'));
                  setIsTextVisible(next.has('text'));
                }}
              >
                <Tooltip
                  label={isScanVisible ? 'Hide scan viewer' : 'Show scan viewer'}
                >
                  <Toggle
                    id="scan"
                    aria-label={
                      isScanVisible ? 'Close scan viewer' : 'Open scan viewer'
                    }
                    icon={
                      <IconScan className="segmented-icon" />
                    }
                  >
                    Scan
                  </Toggle>
                </Tooltip>
                <Tooltip
                  label={isTextVisible
                    ? 'Hide transcription viewer'
                    : 'Show transcription viewer'}
                >
                  <Toggle
                    id="text"
                    aria-label={
                      isTextVisible
                        ? 'Close transcription viewer'
                        : 'Open transcription viewer'
                    }
                    icon={
                      <IconTranscription className="segmented-icon" />
                    }
                  >
                    Text
                  </Toggle>
                </Tooltip>
              </ToggleGroup>
            </div>

            <div className="top-bar-center">
              <ManifestContentWarning />
              {topCenter}
            </div>

            <div className="top-bar-group right">
              <TooltipIconButton
                aria-label="Swap scan and transcription viewer"
                tooltip="Swap scan and transcription viewer"
                isActive={isViewerOrderSwapped}
                isDisabled={!isScanVisible || !isTextVisible}
                className={TOP_BAR_BUTTON}
                icon={
                  <IconSwap className="toolbar-icon" />
                }
                onPress={() => setIsViewerOrderSwapped((v) => !v)}
              />
              <ManifestEntityHighlightMenu />
              <ManifestLayoutElementsToggle />
              {topRight}
              {onClose && <ManifestCloseButton onClose={onClose} />}
            </div>
          </header>

          <main className="body">
            {error && <ManifestError error={error}/>}
            {isScanVisible && isTextVisible ? (
              <div className="split-viewer">
                <SplitPaneLayout>
                  {splitPanes}
                </SplitPaneLayout>
              </div>
            ) : (
              (scanPane ?? transcriptionPane)
            )}
          </main>

          <footer className="bottom-bar">
            {bottom}
          </footer>
        </div>
      </div>
    </div>
  );
}
