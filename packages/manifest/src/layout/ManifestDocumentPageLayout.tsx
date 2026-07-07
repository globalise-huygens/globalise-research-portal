'use client';

import * as React from 'react';
import {
  cn,
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
  IconScan,
  IconSidebar,
  IconTranscription,
} from './designSystemCompat';

import { CollapsedMetadataRail } from './CollapsedMetadataRail';
import { ExpandedMetadataSidebar } from './ExpandedMetadataSidebar';
import { TooltipIconButton } from './TooltipIconButton';
import { TOP_BAR_BUTTON } from './buttonClasses';

import './ManifestDocumentPageLayout.css';

type Props = {
  topLeft?: React.ReactNode;
  topCenter?: React.ReactNode;
  topRight?: React.ReactNode;
  scan?: React.ReactNode;
  transcription?: React.ReactNode;
  bottom?: React.ReactNode;
};

export function ManifestDocumentPageLayout(
  { topLeft, topCenter, topRight, scan, transcription, bottom }: Props,
) {
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
      className={cn('relative', isTextVisible ? 'border-r border-brand-black' : 'border-r-0')}
    >
      <DocumentDetailCanvas className="bg-neutral-500">
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
    <div className="gds relative flex h-screen flex-col overflow-hidden">
      <div
        id="document-detail-sidebar"
        className={cn(
          'absolute bottom-0 left-0 top-0 z-10 overflow-hidden transition-[width] duration-150 ease-out motion-reduce:transition-none',
          isSidebarExpanded
            ? 'w-overlay-document-viewer-sidebar-width'
            : 'w-overlay-document-viewer-rail-width',
        )}
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
        className="flex min-h-0 flex-1 flex-col transition-[margin-left] duration-150 ease-out motion-reduce:transition-none"
        style={{
          marginLeft: isSidebarExpanded
            ? 'var(--overlay-document-viewer-sidebar-width)'
            : 'var(--overlay-document-viewer-rail-width)',
        }}
      >
        <DocumentDetailTopBar
          className="h-s64 items-center border-b-0 bg-neutral-900 pr-s24"
          style={{ paddingLeft: 'var(--s16)' }}
        >
          <DocumentDetailBarGroup className="min-w-0 flex-1 justify-start gap-s8">
            <TooltipIconButton
              aria-controls="document-detail-sidebar"
              aria-expanded={isSidebarExpanded}
              aria-label={isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'}
              tooltip={isSidebarExpanded ? 'Closes sidebar' : 'Opens sidebar'}
              isActive={isSidebarExpanded}
              className={TOP_BAR_BUTTON}
              icon={<IconSidebar className="h-s16 w-s16" />}
              onPress={() => setIsSidebarExpanded((v) => !v)}
            />

            {topLeft && (
              <div className="min-w-0 flex-1">
                {topLeft}
              </div>
            )}

            <span className="font-sans text-xs text-brand-white/70">|</span>

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
                  icon={<IconScan className="h-4.5 w-4.5" />}
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
                  icon={<IconTranscription className="h-4.5 w-4.5" />}
                >
                  Text
                </DocumentDetailSegmentedToggleItem>
              </DocumentDetailTooltip>
            </DocumentDetailSegmentedToggleGroup>
          </DocumentDetailBarGroup>

          <div className="min-w-0 flex-1 text-center">
            {topCenter}
          </div>

          <DocumentDetailBarGroup className="flex-1 min-w-0 ml-auto gap-s8 justify-end">
            {topRight}
          </DocumentDetailBarGroup>
        </DocumentDetailTopBar>

        <DocumentDetailBody>
          <DocumentDetailSplitViewer
            className={cn(
              isScanVisible && isTextVisible ? 'lg:grid-cols-2' : 'lg:grid-cols-1',
            )}
          >
            {scanPane}
            {isTextVisible && (
              <DocumentDetailViewerPane key="text" className="relative border-r-0">
                <DocumentDetailTranscriptCanvas className="bg-neutral-500">
                  {transcription}
                </DocumentDetailTranscriptCanvas>
              </DocumentDetailViewerPane>
            )}
          </DocumentDetailSplitViewer>
        </DocumentDetailBody>

        <DocumentDetailBottomBar className="border-t-0 justify-center gap-s8">
          {bottom}
        </DocumentDetailBottomBar>
      </div>
    </div>
  );
}
