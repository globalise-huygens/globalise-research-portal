import {
  IconClose,
  IconEntities,
  IconEntityCommodity,
  IconEntityDate,
  IconEntityDocument,
  IconEntityOrganisation,
  IconEntityPerson,
  IconEntityPlace,
  IconEntityShip,
  IconEvents,
  IconLayoutElements,
  IconPairedPage,
  IconPictureInPicture,
  IconScan,
  IconSidebar,
  IconSwap,
  IconTableOfContent,
  IconTranscription,
} from '../icons';
import * as React from 'react';
import {
  ContentWarningControl,
  DocumentDetailIconButton,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
} from './DocumentDetailControls';
import {
  type DocumentDetailEntityHighlightCategory,
  DocumentDetailEntityHighlightMenu,
} from '../ui';
import {
  DocumentDetailBarGroup,
  DocumentDetailTopBar as DocumentDetailTopBarPrimitive,
} from './DocumentDetailLayout';
import type {
  ManifestViewerContent,
  ManifestViewerTagGroup,
} from './ManifestViewerTypes';

function getEntityIcon(icon: ManifestViewerTagGroup['icon']) {
  const className = 'manifest-viewer-icon';

  switch (icon) {
    case 'person':
      return <IconEntityPerson className={className} />;
    case 'organisation':
      return <IconEntityOrganisation className={className} />;
    case 'ship':
      return <IconEntityShip className={className} />;
    case 'commodity':
      return <IconEntityCommodity className={className} />;
    case 'date':
      return <IconEntityDate className={className} />;
    case 'place':
      return <IconEntityPlace className={className} />;
    case 'document':
      return <IconEntityDocument className={className} />;
    case 'quantity':
      return <IconTableOfContent className={className} />;
  }
}

export function ManifestViewerTopBar({
  content,
  isSidebarOpen,
  isScanVisible,
  isTextVisible,
  isWarningOpen,
  isViewerOrderSwapped,
  isPairedPageView,
  isMiniWindowEnabled,
  onSidebarToggle,
  onPaneToggle,
  onWarningOpenChange,
  onViewerOrderToggle,
  onPairedPageToggle,
  onMiniWindowToggle,
  onClose,
}: {
  content: ManifestViewerContent;
  isSidebarOpen: boolean;
  isScanVisible: boolean;
  isTextVisible: boolean;
  isWarningOpen: boolean;
  isViewerOrderSwapped: boolean;
  isPairedPageView: boolean;
  isMiniWindowEnabled: boolean;
  onSidebarToggle: () => void;
  onPaneToggle: (pane: 'scan' | 'text') => void;
  onWarningOpenChange: (isOpen: boolean) => void;
  onViewerOrderToggle: () => void;
  onPairedPageToggle: () => void;
  onMiniWindowToggle: () => void;
  onClose: () => void;
}) {
  const [entityHighlightKeys, setEntityHighlightKeys] = React.useState<
    Set<string>
  >(() => new Set());
  const [isEventHighlightingEnabled, setIsEventHighlightingEnabled] =
    React.useState(false);
  const [isLayoutHighlightingEnabled, setIsLayoutHighlightingEnabled] =
    React.useState(false);
  const areBothPanesVisible = isScanVisible && isTextVisible;

  const entityHighlightCategories = React.useMemo<
    DocumentDetailEntityHighlightCategory[]
  >(
    () =>
      (content.entityGroups ?? [])
        .filter((group) => group.kind === 'Classified')
        .map((group) => ({
          id: group.id,
          label: group.label,
          count: group.count,
          icon: getEntityIcon(group.icon),
          tone: group.icon,
          subcategories: group.subcategories?.map((subcategory) => ({
            id: subcategory.id,
            label: subcategory.label,
            count: subcategory.count,
          })),
        })),
    [content.entityGroups],
  );

  return (
    <DocumentDetailTopBarPrimitive className="manifest-viewer-top-bar">
      <DocumentDetailBarGroup className="manifest-viewer-mode-group">
        <DocumentDetailIconButton
          aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          tooltip={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          icon={<IconSidebar className="manifest-viewer-icon" />}
          isActive={isSidebarOpen}
          onPress={onSidebarToggle}
        />
        <span aria-hidden="true" className="manifest-viewer-divider" />
        <DocumentDetailSegmentedToggleGroup
          aria-label="Primary viewer mode controls"
          selectionMode="multiple"
          disallowEmptySelection
          selectedKeys={
            new Set([
              ...(isScanVisible ? ['scan'] : []),
              ...(isTextVisible ? ['text'] : []),
            ])
          }
          onSelectionChange={(keys) => {
            const nextSelection = new Set(
              Array.from(keys, (key) => String(key)),
            );

            if (nextSelection.size === 0) {
              return;
            }

            const shouldShowScan = nextSelection.has('scan');
            const shouldShowText = nextSelection.has('text');

            if (shouldShowScan !== isScanVisible) {
              onPaneToggle('scan');
            }

            if (shouldShowText !== isTextVisible) {
              onPaneToggle('text');
            }
          }}
        >
          <DocumentDetailSegmentedToggleItem
            id="scan"
            aria-label={
              isScanVisible ? 'Close scan viewer' : 'Open scan viewer'
            }
            size="regular"
          >
            <IconScan className="manifest-viewer-icon" />
            <span>Scan</span>
          </DocumentDetailSegmentedToggleItem>
          <DocumentDetailSegmentedToggleItem
            id="text"
            aria-label={
              isTextVisible
                ? 'Close transcription viewer'
                : 'Open transcription viewer'
            }
            size="regular"
          >
            <IconTranscription className="manifest-viewer-icon" />
            <span>Text</span>
          </DocumentDetailSegmentedToggleItem>
        </DocumentDetailSegmentedToggleGroup>
      </DocumentDetailBarGroup>

      <DocumentDetailBarGroup className="manifest-viewer-warning">
        <ContentWarningControl
          warning={content.contentWarning}
          isOpen={isWarningOpen}
          onOpenChange={onWarningOpenChange}
        />
      </DocumentDetailBarGroup>

      <DocumentDetailBarGroup className="manifest-viewer-toolbar-actions">
        <DocumentDetailIconButton
          aria-label="Swap panes"
          tooltip="Swap scan and transcription"
          icon={<IconSwap className="manifest-viewer-icon" />}
          isActive={isViewerOrderSwapped}
          onPress={onViewerOrderToggle}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Toggle mini window"
          tooltip="Toggle mini window"
          icon={
            <IconPictureInPicture className="manifest-viewer-icon" />
          }
          isActive={isMiniWindowEnabled && !areBothPanesVisible}
          isDisabled={areBothPanesVisible}
          onPress={onMiniWindowToggle}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Toggle paired page"
          tooltip="Toggle paired page"
          icon={<IconPairedPage className="manifest-viewer-icon" />}
          isActive={isPairedPageView && !areBothPanesVisible}
          isDisabled={areBothPanesVisible}
          onPress={onPairedPageToggle}
          variant="quiet"
        />
        <span aria-hidden="true" className="manifest-viewer-divider" />
        <DocumentDetailEntityHighlightMenu
          categories={entityHighlightCategories}
          selectedKeys={entityHighlightKeys}
          onSelectedKeysChange={setEntityHighlightKeys}
          triggerIcon={
            <IconEntities className="manifest-viewer-icon" />
          }
          triggerClassName="manifest-viewer-icon-button manifest-viewer-icon-button--quiet"
          triggerLabel="Entity highlights"
          title="Entity highlights"
          allLabel="All entity highlights"
          allDescription="Toggle entity classes to preview matching highlights in the transcription text"
        />
        <DocumentDetailIconButton
          aria-label="Highlight event tags"
          tooltip="Highlight event tags"
          icon={<IconEvents className="manifest-viewer-icon" />}
          isActive={isEventHighlightingEnabled}
          onPress={() => setIsEventHighlightingEnabled((current) => !current)}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Highlight layout elements"
          tooltip="Highlight layout elements and show line numbers"
          icon={<IconLayoutElements className="manifest-viewer-icon" />}
          isActive={isLayoutHighlightingEnabled}
          onPress={() => setIsLayoutHighlightingEnabled((current) => !current)}
          variant="quiet"
        />
        <span aria-hidden="true" className="manifest-viewer-divider" />
        <DocumentDetailIconButton
          aria-label="Close document detail"
          tooltip="Close"
          icon={<IconClose className="manifest-viewer-icon" />}
          onPress={onClose}
          variant="quiet"
        />
      </DocumentDetailBarGroup>
    </DocumentDetailTopBarPrimitive>
  );
}
