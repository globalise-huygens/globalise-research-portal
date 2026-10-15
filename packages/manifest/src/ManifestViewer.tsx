'use client';

import './ManifestViewer.css';
import {
  cn,
  IconClose,
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
import { Button as AriaButton } from 'react-aria-components';
import { MetadataPanel, TocPanel } from '@globalise/metadata';
import { sidebarPanels, type SidebarId } from './layout/sidebar-panels';
import { TOP_BAR_BUTTON } from './layout/buttonClasses';
import { CollapsedMetadataRail } from './layout/CollapsedMetadataRail';
import { ExpandedMetadataSidebar } from './layout/ExpandedMetadataSidebar';
import { ManifestContentWarning } from './layout/ManifestContentWarning';
import { ManifestEntityHighlightMenu } from './layout/ManifestEntityHighlightMenu';
import { ManifestLayoutElementsToggle } from './layout/ManifestLayoutElementsToggle';
import { SplitPaneLayout } from './layout';
import { TooltipIconButton } from './layout/TooltipIconButton';

export type ManifestViewerProps = {
  topLeft?: React.ReactNode;
  topCenter?: React.ReactNode;
  topRight?: React.ReactNode;
  scan?: React.ReactNode;
  transcription?: React.ReactNode;
  bottom?: React.ReactNode;
  onClose?: () => void;
};

type ViewerPaneProps = {
  children?: React.ReactNode;
  isBordered?: boolean;
  type: 'scan' | 'transcription';
};

const mobileLayoutQuery = '(max-width: 767px)';
type MobileView = 'scan' | 'text' | SidebarId;
const mobileItems: { id: MobileView; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'scan', label: 'Scan', description: 'Scan viewer', icon: <IconScan /> },
  { id: 'text', label: 'Text', description: 'Transcription viewer', icon: <IconTranscription /> },
  ...(['toc', 'inventory', 'entities', 'events'] as const).map((id) => {
    const panel = sidebarPanels.find((panel) => panel.id === id)!;
    const label = { toc: 'Contents', inventory: 'Inventory', entities: 'Entities', events: 'Events' }[id];
    return { ...panel, description: panel.label, label };
  }),
];

function ViewerPane({ children, isBordered = false, type }: ViewerPaneProps) {
  const paneClassName = cn('pane', isBordered && 'bordered');

  return (
    <section className={paneClassName} data-view={type}>
      <div className="canvas">{children}</div>
    </section>
  );
}

export function ManifestViewer({
  topLeft,
  topCenter,
  topRight,
  scan,
  transcription,
  bottom,
  onClose,
}: ManifestViewerProps) {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);
  const [mobileView, setMobileView] = React.useState<MobileView>('scan');
  const [mobileReader, setMobileReader] = React.useState<'scan' | 'text'>('scan');
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const [isScanVisible, setIsScanVisible] = React.useState(true);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
  const [isViewerOrderSwapped, setIsViewerOrderSwapped] =
    React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    () => new Set(['inventory']),
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(mobileLayoutQuery);
    const updateLayout = ({ matches }: { matches: boolean }) => {
      setIsMobile(matches);
      if (matches) {
        setIsSidebarExpanded(false);
      }
    };
    updateLayout(mediaQuery);
    mediaQuery.addEventListener('change', updateLayout);
    return () => {
      mediaQuery.removeEventListener('change', updateLayout);
    };
  }, []);

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
  const mobilePanel = sidebarPanels.find((panel) => panel.id === mobileView);

  // Resolve the layout before mounting viewers, so phones do not briefly load both.
  if (isMobile === null) {return <div className="gds manifest-viewer" aria-busy="true" />;}

  return (
    <div className="gds manifest-viewer">
      <div
        className="frame"
        data-sidebar-expanded={isSidebarExpanded ? 'true' : 'false'}
      >
        {!isMobile && <div
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
        </div>}

        <div className="main">
          <header className="top-bar">
            <div className="top-bar-group left">
              {!isMobile && <TooltipIconButton
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
              />}

              {!isMobile && <span className="top-bar-divider">
                |
              </span>}

              {topLeft}

              {!isMobile && <ToggleGroup
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
              </ToggleGroup>}
            </div>

            <div className="top-bar-center">
              <ManifestContentWarning iconOnly={isMobile} />
              {topCenter}
            </div>

            <div className="top-bar-group right">
              {!isMobile && <TooltipIconButton
                aria-label="Swap scan and transcription viewer"
                tooltip="Swap scan and transcription viewer"
                isActive={isViewerOrderSwapped}
                isDisabled={!isScanVisible || !isTextVisible}
                className={TOP_BAR_BUTTON}
                icon={
                  <IconSwap className="toolbar-icon" />
                }
                onPress={() => setIsViewerOrderSwapped((v) => !v)}
              />}
              <ManifestEntityHighlightMenu />
              <ManifestLayoutElementsToggle />
              {topRight}
              {onClose && (
                <>
                  <span
                    aria-hidden="true"
                    className="top-bar-divider vertical"
                  />
                  <TooltipIconButton
                    aria-label="Close manifest viewer"
                    tooltip="Close manifest viewer"
                    className={TOP_BAR_BUTTON}
                    icon={
                      <IconClose className="toolbar-icon" />
                    }
                    onPress={onClose}
                  />
                </>
              )}
            </div>
          </header>

          <main className="body" id="manifest-reading-area">
            {isMobile ? (
              <>
                <div className="mobile-reader" data-covered={!!mobilePanel || undefined}
                  aria-hidden={!!mobilePanel} inert={!!mobilePanel}>
                  <ViewerPane key={mobileReader} type={mobileReader === 'text' ? 'transcription' : 'scan'}>
                    {mobileReader === 'text' ? transcription : scan}
                  </ViewerPane>
                </div>
                {mobilePanel && <section className="mobile-information" aria-label={mobilePanel.label}>
                  <h2>{mobilePanel.label}</h2>
                  {mobileView === 'toc' ? <TocPanel /> : mobileView === 'inventory' ? <MetadataPanel />
                    : <p>{mobilePanel.label} are not available yet.</p>}
                </section>}
              </>
            ) : isScanVisible && isTextVisible ? (
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
            <div className="scan-navigation">{bottom}</div>
            {isMobile && <nav className="mobile-information-menu" aria-label="Viewer information">
              {mobileItems.map((item) => <AriaButton key={item.id}
                aria-label={item.description}
                aria-pressed={mobileView === item.id}
                aria-controls="manifest-reading-area"
                onPress={() => {
                  setMobileView(item.id);
                  if (item.id === 'scan' || item.id === 'text') {setMobileReader(item.id);}
                }}>
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </AriaButton>)}
            </nav>}
          </footer>
        </div>
      </div>
    </div>
  );
}
