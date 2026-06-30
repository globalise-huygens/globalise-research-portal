'use client';

import * as React from 'react';
import {
  cn,
  DocumentDetailBarGroup,
  DocumentDetailBody,
  DocumentDetailBottomBar,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailSplitViewer,
  DocumentDetailTooltip,
  DocumentDetailTopBar,
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
      className={cn('relative', isTextVisible ? 'border-r border-brand-black' : 'border-r-0')}
    >
      TODO: Viewer content
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
    <div className="relative flex h-screen flex-col overflow-hidden">
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

          <div className="flex-1 text-center">
            TODO: Centre content
          </div>

          <DocumentDetailBarGroup className="min-w-0 ml-auto gap-s8">
            TODO: Right content
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
                TODO: inventory-panel content
              </DocumentDetailViewerPane>
            )}
          </DocumentDetailSplitViewer>
        </DocumentDetailBody>

        <DocumentDetailBottomBar className="border-t-0 justify-center gap-s8">
          <DocumentDetailBarGroup className="gap-s8">
            <TooltipIconButton
              aria-label="First scan"
              tooltip="Go to first scan"
              tooltipPlacement="top"
              isDisabled={isAtFirst}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconLeftFirst className="h-s16 w-s16" />}
              onPress={() => setCurrentScan(1)}
            />
            <TooltipIconButton
              aria-label="Previous scan"
              tooltip="Go to previous scan"
              tooltipPlacement="top"
              isDisabled={isAtFirst}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconLeft className="h-s16 w-s16" />}
              onPress={() => setCurrentScan((s) => Math.max(s - 1, 1))}
            />

            <span className="min-w-0 inline-flex items-baseline gap-s8 leading-4 text-xs text-neutral-300">
              Scan {currentScan} of {totalScans}
            </span>

            <TooltipIconButton
              aria-label="Next scan"
              tooltip="Go to next scan"
              tooltipPlacement="top"
              isDisabled={isAtLast}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconRight className="h-s16 w-s16" />}
              onPress={() => setCurrentScan((s) => Math.min(s + 1, totalScans))}
            />
            <TooltipIconButton
              aria-label="Last scan"
              tooltip="Go to last scan"
              tooltipPlacement="top"
              isDisabled={isAtLast}
              className={BOTTOM_BAR_BUTTON}
              icon={<IconRightLast className="h-s16 w-s16" />}
              onPress={() => setCurrentScan(totalScans)}
            />
          </DocumentDetailBarGroup>
        </DocumentDetailBottomBar>
      </div>
    </div>
  );
}
