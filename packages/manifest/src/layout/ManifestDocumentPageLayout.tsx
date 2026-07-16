'use client';

import './ManifestDocumentPageLayout.css';
import {
  cn,
  IconScan,
  IconSidebar,
  IconSwap,
  IconTranscription,
} from '@globalise/design';
import {
  BarGroup,
  Body,
  BottomBar,
  Canvas,
  ToggleGroup,
  Toggle,
  Tooltip,
  TopBar,
  TranscriptionCanvas,
  Pane as PaneSurface,
} from '@globalise/design/viewer';
import * as React from 'react';
import { TOP_BAR_BUTTON } from './buttonClasses';
import { CollapsedMetadataRail } from './CollapsedMetadataRail';
import { ExpandedMetadataSidebar } from './ExpandedMetadataSidebar';
import { ManifestContentWarning } from './ManifestContentWarning';
import { ManifestEntityHighlightMenu } from './ManifestEntityHighlightMenu';
import { ManifestLayoutElementsToggle } from './ManifestLayoutElementsToggle';
import { TooltipIconButton } from './TooltipIconButton';
import { SplitPaneLayout } from './splitpane';

type Props = {
  topLeft?: React.ReactNode;
  topCenter?: React.ReactNode;
  topRight?: React.ReactNode;
  scan?: React.ReactNode;
  transcription?: React.ReactNode;
  bottom?: React.ReactNode;
};

type ViewerPaneProps = {
  children?: React.ReactNode;
  isBordered?: boolean;
  type: 'scan' | 'transcription';
};

const mobileLayoutQuery = '(max-width: 767px)';

function ViewerPane({ children, isBordered = false, type }: ViewerPaneProps) {
  const canvasClassName = 'manifest-document-layout__canvas';
  const paneClassName = cn(
    'manifest-document-layout__viewer-pane',
    isBordered && 'manifest-document-layout__viewer-pane--bordered',
  );

  return (
    <PaneSurface className={paneClassName}>
      {type === 'scan' ? (
        <Canvas className={canvasClassName}>
          {children}
        </Canvas>
      ) : (
        <TranscriptionCanvas className={canvasClassName}>
          {children}
        </TranscriptionCanvas>
      )}
    </PaneSurface>
  );
}

export function ManifestDocumentPageLayout({
  topLeft,
  topCenter,
  topRight,
  scan,
  transcription,
  bottom,
}: Props) {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(
    () =>
      typeof window === 'undefined' ||
      !window.matchMedia(mobileLayoutQuery).matches,
  );
  const [isScanVisible, setIsScanVisible] = React.useState(true);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
  const [isViewerOrderSwapped, setIsViewerOrderSwapped] =
    React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    () => new Set(['inventory']),
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(mobileLayoutQuery);
    const collapseSidebarOnMobile = ({ matches }: MediaQueryListEvent) => {
      if (matches) {
        setIsSidebarExpanded(false);
      }
    };

    mediaQuery.addEventListener('change', collapseSidebarOnMobile);
    return () => {
      mediaQuery.removeEventListener('change', collapseSidebarOnMobile);
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

  return (
    <div className="gds manifest-document-layout">
      <div
        className="manifest-document-layout__frame"
        data-sidebar-expanded={isSidebarExpanded ? 'true' : 'false'}
      >
        <div
          id="document-detail-sidebar"
          className="manifest-document-layout__sidebar"
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

        <div className="manifest-document-layout__main">
          <TopBar className="manifest-document-layout__top-bar">
            <BarGroup className="manifest-document-layout__top-bar-group manifest-document-layout__top-bar-group--left">
              <TooltipIconButton
                aria-controls="document-detail-sidebar"
                aria-expanded={isSidebarExpanded}
                aria-label={
                  isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'
                }
                tooltip={isSidebarExpanded ? 'Closes sidebar' : 'Opens sidebar'}
                isActive={isSidebarExpanded}
                className={TOP_BAR_BUTTON}
                icon={<IconSidebar className="manifest-document-layout__toolbar-icon" />}
                onPress={() => setIsSidebarExpanded((v) => !v)}
              />

              <span className="manifest-document-layout__top-bar-divider">
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
                  label={
                    isScanVisible ? 'Closes scan viewer' : 'Opens scan viewer'
                  }
                >
                  <Toggle
                    id="scan"
                    aria-label={
                      isScanVisible ? 'Close scan viewer' : 'Open scan viewer'
                    }
                    icon={
                      <IconScan className="manifest-document-layout__segmented-icon" />
                    }
                  >
                    Scan
                  </Toggle>
                </Tooltip>
                <Tooltip
                  label={
                    isTextVisible
                      ? 'Closes transcription viewer'
                      : 'Opens transcription viewer'
                  }
                >
                  <Toggle
                    id="text"
                    aria-label={
                      isTextVisible
                        ? 'Close transcription viewer'
                        : 'Open transcription viewer'
                    }
                    icon={
                      <IconTranscription className="manifest-document-layout__segmented-icon" />
                    }
                  >
                    Text
                  </Toggle>
                </Tooltip>
              </ToggleGroup>
            </BarGroup>

            <div className="manifest-document-layout__top-bar-center">
              <ManifestContentWarning />
              {topCenter}
            </div>

            <BarGroup className="manifest-document-layout__top-bar-group manifest-document-layout__top-bar-group--right">
              <TooltipIconButton
                aria-label="Swap scan and transcription viewer"
                tooltip="Swap scan and transcription viewer"
                isActive={isViewerOrderSwapped}
                isDisabled={!isScanVisible || !isTextVisible}
                className={TOP_BAR_BUTTON}
                icon={
                  <IconSwap className="manifest-document-layout__toolbar-icon" />
                }
                onPress={() => setIsViewerOrderSwapped((v) => !v)}
              />
              <ManifestEntityHighlightMenu />
              <ManifestLayoutElementsToggle />
              {topRight}
            </BarGroup>
          </TopBar>

          <Body>
            {isScanVisible && isTextVisible ? (
              <div className="manifest-document-layout__split-viewer">
                <SplitPaneLayout>
                  {splitPanes}
                </SplitPaneLayout>
              </div>
            ) : (
              (scanPane ?? transcriptionPane)
            )}
          </Body>

          <BottomBar className="manifest-document-layout__bottom-bar">
            {bottom}
          </BottomBar>
        </div>
      </div>
    </div>
  );
}
