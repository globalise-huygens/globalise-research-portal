'use client';

import {
  cn,
  DocumentDetailBarGroup,
  DocumentDetailBody,
  DocumentDetailBottomBar,
  DocumentDetailIconRail,
  DocumentDetailMetadataSidebar,
  DocumentDetailMetadataSidebarBadge,
  DocumentDetailMetadataSidebarButton,
  DocumentDetailRailButton,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailSplitViewer,
  DocumentDetailToolButton,
  DocumentDetailTooltip,
  DocumentDetailTopBar,
  DocumentDetailViewerPane,
  IconEntities,
  IconEvents,
  IconExpandSection,
  IconInventory,
  IconLeft,
  IconLeftFirst,
  IconRight,
  IconRightLast,
  IconScan,
  IconSidebar,
  IconTableOfContent,
  IconTranscription,
} from '@globalise/design-system';
import * as React from 'react';

/* ------------------------------------------------------------------ */
/*  Sidebar items                                                      */
/* ------------------------------------------------------------------ */

const SIDEBAR_ITEMS = [
  {
    id: 'inventory',
    label: 'Inventory',
    badge: '1664',
    railLabel: '1664',
    icon: <IconInventory className="h-s20 w-s20" />,
  },
  {
    id: 'table-of-contents',
    label: 'Table of Contents',
    icon: <IconTableOfContent className="h-s20 w-s20" />,
  },
  {
    id: 'identified',
    label: 'Entity tags',
    count: '(376)',
    railLabel: '376',
    icon: <IconEntities className="h-s20 w-s20" />,
  },
  {
    id: 'events',
    label: 'Event tags',
    count: '(0)',
    railLabel: '0',
    icon: <IconEvents className="h-s20 w-s20" />,
  },
];

/* ------------------------------------------------------------------ */
/*  Sidebar disclosure chevron                                         */
/* ------------------------------------------------------------------ */

function SidebarDisclosureIcon({ isExpanded = false }: { isExpanded?: boolean }) {
  return (
    <IconExpandSection
      className={cn(
        'h-s20 w-s20 text-current transition-transform duration-100 ease-out motion-reduce:transition-none',
        isExpanded && 'rotate-180',
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Collapsed rail                                                     */
/* ------------------------------------------------------------------ */

function CollapsedMetadataRail({
  onExpandSection,
}: {
  onExpandSection: (sectionId: string) => void;
}) {
  return (
    <DocumentDetailIconRail className="h-full w-full border-r-0 bg-neutral-900">
      {SIDEBAR_ITEMS.map((item) => (
        <DocumentDetailRailButton
          key={item.id}
          aria-label={`Expand ${item.label}`}
          className="border-b-0"
          icon={item.icon}
          label={item.railLabel}
          onPress={() => onExpandSection(item.id)}
        />
      ))}
    </DocumentDetailIconRail>
  );
}

/* ------------------------------------------------------------------ */
/*  Expanded sidebar                                                   */
/* ------------------------------------------------------------------ */

function ExpandedMetadataSidebar({
  expandedSections,
  onToggleSection,
}: {
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}) {
  return (
    <DocumentDetailMetadataSidebar className="w-full overflow-hidden border-r-0">
      {SIDEBAR_ITEMS.map((item) => {
        const isExpanded = expandedSections.has(item.id);
        const panelId = `${item.id}-panel`;

        return (
          <React.Fragment key={item.id}>
            <DocumentDetailMetadataSidebarButton
              aria-controls={panelId}
              aria-expanded={isExpanded}
              className="h-s64 shrink-0"
              icon={item.icon}
              label={item.label}
              count={item.count}
              trailing={<SidebarDisclosureIcon isExpanded={isExpanded} />}
              onPress={() => onToggleSection(item.id)}
            >
              {item.badge && (
                <DocumentDetailMetadataSidebarBadge>
                  {item.badge}
                </DocumentDetailMetadataSidebarBadge>
              )}
            </DocumentDetailMetadataSidebarButton>

            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-label={`${item.label} details`}
                className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden border-b border-brand-white/10 bg-neutral-800 text-brand-white [scrollbar-color:var(--neutral-600)_transparent] [scrollbar-width:thin]"
              >
                {/* Panel content goes here */}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </DocumentDetailMetadataSidebar>
  );
}

/* ------------------------------------------------------------------ */
/*  Tooltip icon button helper                                         */
/* ------------------------------------------------------------------ */

function TooltipIconButton({
  tooltip,
  tooltipPlacement = 'bottom',
  ...buttonProps
}: React.ComponentProps<typeof DocumentDetailToolButton> & {
  tooltip: React.ReactNode;
  tooltipPlacement?: React.ComponentProps<typeof DocumentDetailTooltip>['placement'];
}) {
  return (
    <DocumentDetailTooltip label={tooltip} placement={tooltipPlacement}>
      <DocumentDetailToolButton {...buttonProps} />
    </DocumentDetailTooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared button classes                                              */
/* ------------------------------------------------------------------ */

const TOP_BAR_BUTTON =
  'h-s36 min-w-s36 px-0 duration-100 ease-out motion-reduce:transition-none [&>svg]:h-[18px] [&>svg]:w-[18px]';

const BOTTOM_BAR_BUTTON =
  'h-s24 min-w-s24 rounded-[3px] px-s4 text-neutral-300 duration-100 ease-out data-hovered:bg-brand-white/8 pressed:bg-brand-white/12 data-focus-visible:ring-1 data-disabled:opacity-40 motion-reduce:transition-none [&>svg]:h-s16 [&>svg]:w-s16';

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

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
      if (next.has(sectionId)) {next.delete(sectionId);}
      else {next.add(sectionId);}
      return next;
    });
  }, []);

  const expandSidebarSection = React.useCallback((sectionId: string) => {
    setExpandedSections((prev) => new Set(prev).add(sectionId));
    setIsSidebarExpanded(true);
  }, []);

  const isAtFirst = currentScan === 1;
  const isAtLast = currentScan === totalScans;

  const sidebarWidth = isSidebarExpanded
    ? 'var(--overlay-document-viewer-sidebar-width)'
    : 'var(--overlay-document-viewer-rail-width)';

  /* ---- viewer panes ---- */

  const scanPane = isScanVisible ? (
    <DocumentDetailViewerPane
      key="scan"
      className={cn('relative', isTextVisible ? 'border-r border-brand-black' : 'border-r-0')}
    >
      {/* Scan viewer content */}
    </DocumentDetailViewerPane>
  ) : null;

  const textPane = isTextVisible ? (
    <DocumentDetailViewerPane key="text" className="relative border-r-0">
      {/* Transcript viewer content */}
    </DocumentDetailViewerPane>
  ) : null;

  /* ---- render ---- */

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Sidebar */}
      <div
        id="document-detail-sidebar"
        className={cn(
          'absolute bottom-0 left-0 top-0 z-10 overflow-hidden transition-[width] duration-150 ease-out motion-reduce:transition-none',
        )}
        style={{ width: sidebarWidth }}
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

      {/* Top bar */}
      <DocumentDetailTopBar
        className="border-b-0 pr-s24 transition-[padding-left] duration-150 ease-out"
        style={{ paddingLeft: `calc(${sidebarWidth} + var(--s16))` }}
      >
        <DocumentDetailBarGroup className="min-w-0 justify-self-start gap-s8">
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
            selectedKeys={
              new Set([
                ...(isScanVisible ? ['scan'] : []),
                ...(isTextVisible ? ['text'] : []),
              ])
            }
            onSelectionChange={(keys) => {
              const next = new Set(Array.from(keys).map(String));
              if (next.size === 0) {return;}
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


      </DocumentDetailTopBar>

      {/* Body */}
      <DocumentDetailBody
        className="transition-[padding-left] duration-150 ease-out"
        style={{ paddingLeft: sidebarWidth }}
      >
        <DocumentDetailSplitViewer
          className={cn(
            isScanVisible && isTextVisible ? 'lg:grid-cols-2' : 'lg:grid-cols-1',
          )}
        >
          {scanPane}
          {textPane}
        </DocumentDetailSplitViewer>
      </DocumentDetailBody>

      {/* Bottom bar */}
      <DocumentDetailBottomBar
        className="border-t-0 justify-center gap-s8 transition-[padding-left] duration-150 ease-out"
        style={{ paddingLeft: sidebarWidth }}
      >
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
  );
}