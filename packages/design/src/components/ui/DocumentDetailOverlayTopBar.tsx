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
  DocumentDetailOverlayContent,
  DocumentDetailOverlayTagGroup,
} from './DocumentDetailOverlayTypes';

function getEntityIcon(icon: DocumentDetailOverlayTagGroup['icon']) {
  const className = 'document-detail-overlay-icon';

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

function getEntityHighlightToneClasses(
  icon: DocumentDetailOverlayTagGroup['icon'],
) {
  switch (icon) {
    case 'person':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-person',
        subRowClassName: 'gds-entity-highlight-menu__tone-person',
        textClassName: 'gds-entity-highlight-menu__tone-text-person',
      };
    case 'organisation':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-organisation',
        subRowClassName: 'gds-entity-highlight-menu__tone-organisation',
        textClassName: 'gds-entity-highlight-menu__tone-text-organisation',
      };
    case 'ship':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-ship',
        subRowClassName: 'gds-entity-highlight-menu__tone-ship',
        textClassName: 'gds-entity-highlight-menu__tone-text-ship',
      };
    case 'commodity':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-commodity',
        subRowClassName: 'gds-entity-highlight-menu__tone-commodity',
        textClassName: 'gds-entity-highlight-menu__tone-text-commodity',
      };
    case 'date':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-date',
        subRowClassName: 'gds-entity-highlight-menu__tone-date',
        textClassName: 'gds-entity-highlight-menu__tone-text-date',
      };
    case 'place':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-place',
        subRowClassName: 'gds-entity-highlight-menu__tone-place',
        textClassName: 'gds-entity-highlight-menu__tone-text-place',
      };
    case 'document':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-document',
        subRowClassName: 'gds-entity-highlight-menu__tone-document',
        textClassName: 'gds-entity-highlight-menu__tone-text-document',
      };
    case 'quantity':
      return {
        rowClassName: 'gds-entity-highlight-menu__tone-quantity',
        subRowClassName: 'gds-entity-highlight-menu__tone-quantity',
        textClassName: 'gds-entity-highlight-menu__tone-text-quantity',
      };
  }
}

export function DocumentDetailTopBar({
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
  content: DocumentDetailOverlayContent;
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
          ...getEntityHighlightToneClasses(group.icon),
          subcategories: group.subcategories?.map((subcategory) => ({
            id: subcategory.id,
            label: subcategory.label,
            count: subcategory.count,
          })),
        })),
    [content.entityGroups],
  );

  return (
    <DocumentDetailTopBarPrimitive className="document-detail-overlay-rich-top-bar">
      <DocumentDetailBarGroup className="document-detail-overlay-mode-group">
        <DocumentDetailIconButton
          aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          tooltip={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          icon={<IconSidebar className="document-detail-overlay-icon" />}
          isActive={isSidebarOpen}
          onPress={onSidebarToggle}
        />
        <span aria-hidden="true" className="document-detail-overlay-divider" />
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
            <IconScan className="document-detail-overlay-icon" />
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
            <IconTranscription className="document-detail-overlay-icon" />
            <span>Text</span>
          </DocumentDetailSegmentedToggleItem>
        </DocumentDetailSegmentedToggleGroup>
      </DocumentDetailBarGroup>

      <DocumentDetailBarGroup className="document-detail-overlay-warning">
        <ContentWarningControl
          warning={content.contentWarning}
          isOpen={isWarningOpen}
          onOpenChange={onWarningOpenChange}
        />
      </DocumentDetailBarGroup>

      <DocumentDetailBarGroup className="document-detail-overlay-toolbar-actions">
        <DocumentDetailIconButton
          aria-label="Swap panes"
          tooltip="Swap scan and transcription"
          icon={<IconSwap className="document-detail-overlay-icon" />}
          isActive={isViewerOrderSwapped}
          onPress={onViewerOrderToggle}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Toggle mini window"
          tooltip="Toggle mini window"
          icon={
            <IconPictureInPicture className="document-detail-overlay-icon" />
          }
          isActive={isMiniWindowEnabled && !areBothPanesVisible}
          isDisabled={areBothPanesVisible}
          onPress={onMiniWindowToggle}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Toggle paired page"
          tooltip="Toggle paired page"
          icon={<IconPairedPage className="document-detail-overlay-icon" />}
          isActive={isPairedPageView && !areBothPanesVisible}
          isDisabled={areBothPanesVisible}
          onPress={onPairedPageToggle}
          variant="quiet"
        />
        <span aria-hidden="true" className="document-detail-overlay-divider" />
        <DocumentDetailEntityHighlightMenu
          categories={entityHighlightCategories}
          selectedKeys={entityHighlightKeys}
          onSelectedKeysChange={setEntityHighlightKeys}
          triggerIcon={
            <IconEntities className="document-detail-overlay-icon" />
          }
          triggerClassName="document-detail-overlay-icon-button document-detail-overlay-icon-button--quiet"
          triggerLabel="Entity highlights"
          title="Entity highlights"
          allLabel="All entity highlights"
          allDescription="Toggle entity classes to preview matching highlights in the transcription text"
        />
        <DocumentDetailIconButton
          aria-label="Highlight event tags"
          tooltip="Highlight event tags"
          icon={<IconEvents className="document-detail-overlay-icon" />}
          isActive={isEventHighlightingEnabled}
          onPress={() => setIsEventHighlightingEnabled((current) => !current)}
          variant="quiet"
        />
        <DocumentDetailIconButton
          aria-label="Highlight layout elements"
          tooltip="Highlight layout elements and show line numbers"
          icon={<IconLayoutElements className="document-detail-overlay-icon" />}
          isActive={isLayoutHighlightingEnabled}
          onPress={() => setIsLayoutHighlightingEnabled((current) => !current)}
          variant="quiet"
        />
        <span aria-hidden="true" className="document-detail-overlay-divider" />
        <DocumentDetailIconButton
          aria-label="Close document detail"
          tooltip="Close"
          icon={<IconClose className="document-detail-overlay-icon" />}
          onPress={onClose}
          variant="quiet"
        />
      </DocumentDetailBarGroup>
    </DocumentDetailTopBarPrimitive>
  );
}
