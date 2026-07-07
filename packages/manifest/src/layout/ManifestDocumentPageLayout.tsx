'use client';

import './ManifestDocumentPageLayout.css';
import {
  DocumentDetailBarGroup,
  DocumentDetailBody,
  DocumentDetailBottomBar,
  DocumentDetailCanvas,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailTooltip,
  DocumentDetailTopBar,
  DocumentDetailTranscriptCanvas,
  DocumentDetailViewerPane,
  IconScan,
  IconSidebar,
  IconTranscription,
} from '@globalise/design';
import { SplitPaneLayout } from '@globalise/document';
import * as React from 'react';
import { TOP_BAR_BUTTON } from './buttonClasses';
import { CollapsedMetadataRail } from './CollapsedMetadataRail';
import { ExpandedMetadataSidebar } from './ExpandedMetadataSidebar';
import { TooltipIconButton } from './TooltipIconButton';

type Props = {
  topLeft?: React.ReactNode;
  topCenter?: React.ReactNode;
  topRight?: React.ReactNode;
  scan?: React.ReactNode;
  transcription?: React.ReactNode;
  bottom?: React.ReactNode;
};

export function ManifestDocumentPageLayout({
  topLeft,
  topCenter,
  topRight,
  scan,
  transcription,
  bottom,
}: Props) {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const [isScanVisible, setIsScanVisible] = React.useState(true);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
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
    <DocumentDetailViewerPane
      key="scan"
      className={
        isTextVisible
          ? 'manifest-document-layout__viewer-pane manifest-document-layout__viewer-pane--bordered'
          : 'manifest-document-layout__viewer-pane'
      }
    >
      <DocumentDetailCanvas className="manifest-document-layout__canvas">
        {scan}
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
          <DocumentDetailTopBar className="manifest-document-layout__top-bar">
            <DocumentDetailBarGroup className="min-w-0 flex-1 justify-start gap-s8">
              <TooltipIconButton
                aria-controls="document-detail-sidebar"
                aria-expanded={isSidebarExpanded}
                aria-label={
                  isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'
                }
                tooltip={isSidebarExpanded ? 'Closes sidebar' : 'Opens sidebar'}
                isActive={isSidebarExpanded}
                className={TOP_BAR_BUTTON}
                icon={<IconSidebar className="h-s16 w-s16" />}
                onPress={() => setIsSidebarExpanded((v) => !v)}
              />

              <span className="manifest-document-layout__top-bar-divider">
                |
              </span>

              {topLeft}

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
                  label={
                    isScanVisible ? 'Closes scan viewer' : 'Opens scan viewer'
                  }
                >
                  <DocumentDetailSegmentedToggleItem
                    id="scan"
                    aria-label={
                      isScanVisible ? 'Close scan viewer' : 'Open scan viewer'
                    }
                    icon={
                      <IconScan className="manifest-document-layout__segmented-icon" />
                    }
                  >
                    Scan
                  </DocumentDetailSegmentedToggleItem>
                </DocumentDetailTooltip>
                <DocumentDetailTooltip
                  label={
                    isTextVisible
                      ? 'Closes transcription viewer'
                      : 'Opens transcription viewer'
                  }
                >
                  <DocumentDetailSegmentedToggleItem
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
                  </DocumentDetailSegmentedToggleItem>
                </DocumentDetailTooltip>
              </DocumentDetailSegmentedToggleGroup>
            </DocumentDetailBarGroup>

            <div className="manifest-document-layout__top-bar-center">
              {topCenter}
            </div>

            <DocumentDetailBarGroup className="manifest-document-layout__top-bar-group manifest-document-layout__top-bar-group--right">
              {topRight}
            </DocumentDetailBarGroup>
          </DocumentDetailTopBar>

          <DocumentDetailBody>
            {isScanVisible && isTextVisible ? (
              <div className="manifest-document-layout__split-viewer">
                <SplitPaneLayout>
                  <DocumentDetailViewerPane
                    key="scan"
                    className="manifest-document-layout__viewer-pane manifest-document-layout__viewer-pane--bordered"
                  >
                    <DocumentDetailCanvas className="manifest-document-layout__canvas">
                      {scan}
                    </DocumentDetailCanvas>
                  </DocumentDetailViewerPane>
                  <DocumentDetailViewerPane
                    key="text"
                    className="manifest-document-layout__viewer-pane"
                  >
                    <DocumentDetailTranscriptCanvas className="manifest-document-layout__canvas">
                      {transcription}
                    </DocumentDetailTranscriptCanvas>
                  </DocumentDetailViewerPane>
                </SplitPaneLayout>
              </div>
            ) : (
              (scanPane ??
              (isTextVisible && (
                <DocumentDetailViewerPane
                  key="text"
                  className="manifest-document-layout__viewer-pane"
                >
                  <DocumentDetailTranscriptCanvas className="manifest-document-layout__canvas">
                    {transcription}
                  </DocumentDetailTranscriptCanvas>
                </DocumentDetailViewerPane>
              )))
            )}
          </DocumentDetailBody>

          <DocumentDetailBottomBar className="manifest-document-layout__bottom-bar">
            {bottom}
          </DocumentDetailBottomBar>
        </div>
      </div>
    </div>
  );
}
