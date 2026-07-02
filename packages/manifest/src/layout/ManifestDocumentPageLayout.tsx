'use client';

import * as React from 'react';
import {
  DocumentDetailBarGroup,
  DocumentDetailBody,
  DocumentDetailBottomBar,
  DocumentDetailCanvas,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailSplitViewer,
  DocumentDetailTooltip,
  DocumentDetailTopBar,
  DocumentDetailTranscriptCanvas,
  DocumentDetailViewerPane,
  IconLeft,
  IconLeftFirst,
  IconRight,
  IconRightLast,
  IconScan,
  IconSidebar,
  IconTranscription,
} from '@globalise/design-system';

import { CollapsedMetadataRail } from './CollapsedMetadataRail';
import { ExpandedMetadataSidebar } from './ExpandedMetadataSidebar';
import { TooltipIconButton } from './TooltipIconButton';
import { TOP_BAR_BUTTON, BOTTOM_BAR_BUTTON } from './buttonClasses';

import './ManifestDocumentPageLayout.css';

export function ManifestDocumentPageLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const [isScanVisible, setIsScanVisible] = React.useState(true);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    () => new Set(['inventory']),
  );
  const [currentScan, setCurrentScan] = React.useState(1);
  const totalScans = 26;

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

  const isAtFirst = currentScan === 1;
  const isAtLast = currentScan === totalScans;

  const scanPane = isScanVisible ? (
    <DocumentDetailViewerPane
      key="scan"
      className={
        isTextVisible
          ? 'manifest-document-layout__viewer-pane manifest-document-layout__viewer-pane--bordered'
          : 'manifest-document-layout__viewer-pane'
      }
    >
      <DocumentDetailCanvas className="manifest-document-layout__canvas">
        TODO: Viewer content
      </DocumentDetailCanvas>
    </DocumentDetailViewerPane>
  ) : null;

  const selectedKeys = new Array<string>();
  if (isScanVisible) {
    selectedKeys.push('scan');
  }
  if (isTextVisible) {
    selectedKeys.push('text');
  }
  return (
    <div className="gds manifest-document-layout">
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

      <div
        className="manifest-document-layout__main"
        style={{
          marginLeft: isSidebarExpanded
            ? 'var(--overlay-document-viewer-sidebar-width)'
            : 'var(--overlay-document-viewer-rail-width)',
        }}
      >
        <DocumentDetailTopBar
          className="manifest-document-layout__top-bar"
          style={{ paddingLeft: 'var(--s16)' }}
        >
          <DocumentDetailBarGroup className="manifest-document-layout__top-bar-group manifest-document-layout__top-bar-group--left">
            <TooltipIconButton
              aria-controls="document-detail-sidebar"
              aria-expanded={isSidebarExpanded}
              aria-label={isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'}
              tooltip={isSidebarExpanded ? 'Closes sidebar' : 'Opens sidebar'}
              isActive={isSidebarExpanded}
              className={TOP_BAR_BUTTON}
              icon={<IconSidebar className="manifest-document-layout__toolbar-icon" />}
              onPress={() => setIsSidebarExpanded((v) => !v)}
            />

            <span className="manifest-document-layout__top-bar-divider">|</span>

            <DocumentDetailSegmentedToggleGroup
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
              <DocumentDetailTooltip
                label={isScanVisible ? 'Closes scan viewer' : 'Opens scan viewer'}
              >
                <DocumentDetailSegmentedToggleItem
                  id="scan"
                  aria-label={isScanVisible ? 'Close scan viewer' : 'Open scan viewer'}
                  icon={<IconScan className="manifest-document-layout__segmented-icon" />}
                >
                  Scan
                </DocumentDetailSegmentedToggleItem>
              </DocumentDetailTooltip>
              <DocumentDetailTooltip
                label={isTextVisible ? 'Closes transcription viewer' : 'Opens transcription viewer'}
              >
                <DocumentDetailSegmentedToggleItem
                  id="text"
                  aria-label={isTextVisible ? 'Close transcription viewer' : 'Open transcription viewer'}
                  icon={<IconTranscription className="manifest-document-layout__segmented-icon" />}
                >
                  Text
                </DocumentDetailSegmentedToggleItem>
              </DocumentDetailTooltip>
            </DocumentDetailSegmentedToggleGroup>
          </DocumentDetailBarGroup>

          <div className="manifest-document-layout__top-bar-center">
            TODO: Centre content
          </div>

          <DocumentDetailBarGroup className="manifest-document-layout__top-bar-group manifest-document-layout__top-bar-group--right">
            TODO: Right content
          </DocumentDetailBarGroup>
        </DocumentDetailTopBar>

        <DocumentDetailBody>
          <DocumentDetailSplitViewer
            className="manifest-document-layout__split-viewer"
            data-layout={isScanVisible && isTextVisible ? 'split' : 'single'}
          >
            {scanPane}
            {isTextVisible && (
              <DocumentDetailViewerPane key="text" className="manifest-document-layout__viewer-pane">
                <DocumentDetailTranscriptCanvas className="manifest-document-layout__canvas">
                  TODO: Transcript content
                </DocumentDetailTranscriptCanvas>
              </DocumentDetailViewerPane>
            )}
          </DocumentDetailSplitViewer>
        </DocumentDetailBody>

        <DocumentDetailBottomBar className="manifest-document-layout__bottom-bar">
          <DocumentDetailBarGroup className="manifest-document-layout__bottom-bar-group">
            <TooltipIconButton
              aria-label="First scan"
              tooltip="Go to first scan"
              tooltipPlacement="top"
              isDisabled={isAtFirst}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconLeftFirst className="manifest-document-layout__toolbar-icon" />}
              onPress={() => setCurrentScan(1)}
            />
            <TooltipIconButton
              aria-label="Previous scan"
              tooltip="Go to previous scan"
              tooltipPlacement="top"
              isDisabled={isAtFirst}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconLeft className="manifest-document-layout__toolbar-icon" />}
              onPress={() => setCurrentScan((s) => Math.max(s - 1, 1))}
            />

            <span className="manifest-document-layout__scan-count">
              Scan {currentScan} of {totalScans}
            </span>

            <TooltipIconButton
              aria-label="Next scan"
              tooltip="Go to next scan"
              tooltipPlacement="top"
              isDisabled={isAtLast}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconRight className="manifest-document-layout__toolbar-icon" />}
              onPress={() => setCurrentScan((s) => Math.min(s + 1, totalScans))}
            />
            <TooltipIconButton
              aria-label="Last scan"
              tooltip="Go to last scan"
              tooltipPlacement="top"
              isDisabled={isAtLast}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconRightLast className="manifest-document-layout__toolbar-icon" />}
              onPress={() => setCurrentScan(totalScans)}
            />
          </DocumentDetailBarGroup>
        </DocumentDetailBottomBar>
      </div>
    </div>
  );
}
