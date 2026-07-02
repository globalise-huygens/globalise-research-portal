import {
  EntityTag,
  IconCopy,
  IconEntities,
  IconEntityCommodity,
  IconEntityDate,
  IconEntityDocument,
  IconEntityOrganisation,
  IconEntityPerson,
  IconEntityPlace,
  IconEntityShip,
  IconEvents,
  IconExpandSection,
  IconExternalLink,
  IconInventory,
  IconScan,
  IconSwap,
  IconTableOfContent,
} from '@/index';
import * as React from 'react';
import {
  DocumentDetailCheckbox,
  DocumentDetailRailButton,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
} from './DocumentDetailControls';
import {
  DocumentDetailIconRail,
  DocumentDetailMetadataSidebar,
  DocumentDetailMetadataSidebarBadge,
} from './DocumentDetailLayout';
import { DocumentDetailReferenceCard } from './DocumentDetailReferenceCard';
import { DocumentDetailSidebarSection } from './DocumentDetailSidebarSection';
import type {
  DocumentDetailOverlayContent,
  DocumentDetailOverlayDocument,
  DocumentDetailOverlayIdentifiedEntity,
  DocumentDetailOverlayScan,
  DocumentDetailOverlayScanRenderer,
  DocumentDetailOverlayTagGroup,
} from './DocumentDetailOverlayTypes';

type SidebarSectionId = 'inventory' | 'contents' | 'entities' | 'events';

type InventoryHierarchyNode = {
  item: NonNullable<DocumentDetailOverlayContent['inventoryHierarchy']>[number];
  children: InventoryHierarchyNode[];
};

function buildInventoryHierarchyTree(
  items: NonNullable<DocumentDetailOverlayContent['inventoryHierarchy']>,
) {
  const roots: InventoryHierarchyNode[] = [];
  const stack: InventoryHierarchyNode[] = [];

  items.forEach((item) => {
    const node: InventoryHierarchyNode = { item, children: [] };

    while (
      stack.length > 0 &&
      stack[stack.length - 1].item.level >= item.level
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  });

  return roots;
}

function InventoryHierarchyTree({
  nodes,
  depth = 0,
}: {
  nodes: InventoryHierarchyNode[];
  depth?: number;
}) {
  return (
    <ol
      className="document-detail-overlay-inventory-hierarchy"
      data-depth={String(depth)}
    >
      {nodes.map((node) => (
        <li
          key={`${node.item.level}-${node.item.label}`}
          data-current={node.item.isCurrent ? 'true' : 'false'}
        >
          {node.item.isCurrent ? (
            <span className="document-detail-overlay-inventory-current-chip">
              {node.item.label}
            </span>
          ) : (
            node.item.label
          )}
          {node.children.length ? (
            <InventoryHierarchyTree nodes={node.children} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function SidebarDisclosureIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <IconExpandSection
      className="document-detail-overlay-chevron document-detail-overlay-icon-medium"
      data-expanded={isExpanded ? 'true' : 'false'}
    />
  );
}

function SidebarScanCard({
  scan,
  isSelected,
  renderScanThumbnail,
  onSelect,
}: {
  scan: DocumentDetailOverlayScan;
  isSelected: boolean;
  renderScanThumbnail: DocumentDetailOverlayScanRenderer;
  onSelect: () => void;
}) {
  const label = `Scan ${scan.archiveScan}`;
  const pageCount = scan.pages?.length === 2 ? 2 : 1;

  return (
    <DocumentDetailReferenceCard
      isSelected={isSelected}
      className="document-detail-overlay-toc-card"
      data-current-scan={isSelected ? 'true' : 'false'}
      onClick={onSelect}
      thumbnail={renderScanThumbnail({ scan, label, pageCount })}
      heading={
        <span className="document-detail-overlay-toc-heading">
          Scan {scan.archiveScan}
          <span>| in doc. {scan.documentScan}</span>
          <IconCopy className="document-detail-overlay-icon-small" />
        </span>
      }
      snippet={scan.snippet}
      meta={
        <span className="document-detail-overlay-toc-meta">
          NA Identifier: {scan.identifier.replace('NL-HaNA_1.04.02_1664_', '')}
          <IconExternalLink className="document-detail-overlay-icon-small" />
        </span>
      }
    />
  );
}

function TagGroupIcon({
  icon,
}: {
  icon: DocumentDetailOverlayTagGroup['icon'];
}) {
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

function getDocuments(content: DocumentDetailOverlayContent) {
  if (content.tableOfContentsDocuments?.length) {
    return content.tableOfContentsDocuments;
  }

  return [
    {
      id: 'document-current',
      title: content.metadata.titles,
      scans: content.tableOfContents,
      hasResults: content.tableOfContents.some((scan) => scan.hasResults),
    },
  ];
}

function getDocumentHasResults(document: DocumentDetailOverlayDocument) {
  return document.hasResults ?? document.scans.some((scan) => scan.hasResults);
}

function getDocumentByArchiveScan(
  documents: DocumentDetailOverlayDocument[],
  archiveScan: number,
) {
  return documents.find((document) =>
    document.scans.some((scan) => scan.archiveScan === archiveScan),
  );
}

function DocumentRow({
  document,
  currentArchiveScan,
  hitsOnly,
  isExpanded,
  renderScanThumbnail,
  onToggleExpanded,
  onSelectScan,
}: {
  document: DocumentDetailOverlayDocument;
  currentArchiveScan: number;
  hitsOnly: boolean;
  isExpanded: boolean;
  renderScanThumbnail: DocumentDetailOverlayScanRenderer;
  onToggleExpanded: () => void;
  onSelectScan: (scan: DocumentDetailOverlayScan) => void;
}) {
  const isCurrentDocument = document.scans.some(
    (scan) => scan.archiveScan === currentArchiveScan,
  );
  const visibleScans = hitsOnly
    ? document.scans.filter((scan) => scan.hasResults)
    : document.scans;
  const selectedScan =
    document.scans.find((scan) => scan.archiveScan === currentArchiveScan) ??
    document.scans[0];

  return (
    <article
      className="document-detail-overlay-toc-document"
      data-current={isCurrentDocument ? 'true' : 'false'}
      data-current-document={isCurrentDocument ? 'true' : 'false'}
      data-has-results={getDocumentHasResults(document) ? 'true' : 'false'}
    >
      <div className="document-detail-overlay-toc-document-header">
        <button
          type="button"
          className="document-detail-overlay-toc-document-button"
          aria-current={isCurrentDocument ? 'true' : undefined}
          onClick={() => selectedScan && onSelectScan(selectedScan)}
        >
          <IconEntityDocument className="document-detail-overlay-icon" />
          <span>{document.title}</span>
          <small>
            {document.scans.length} scan{document.scans.length === 1 ? '' : 's'}
            {getDocumentHasResults(document) ? ' · hits' : ''}
          </small>
        </button>
        <button
          type="button"
          className="document-detail-overlay-toc-document-toggle"
          aria-label={isExpanded ? 'Collapse document' : 'Expand document'}
          aria-expanded={isExpanded}
          onClick={onToggleExpanded}
        >
          <SidebarDisclosureIcon isExpanded={isExpanded} />
        </button>
      </div>

      {isExpanded && document.metadata ? (
        <dl className="document-detail-overlay-toc-document-metadata">
          {document.metadata.map(([label, value, badge]) => (
            <div key={`${label}-${value}`}>
              <dt>{label}</dt>
              <dd>
                {value}
                {badge ? <span>{badge}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {isExpanded ? (
        <div className="document-detail-overlay-toc-document-scans">
          {visibleScans.map((scan) => (
            <SidebarScanCard
              key={scan.archiveScan}
              scan={scan}
              isSelected={scan.archiveScan === currentArchiveScan}
              renderScanThumbnail={renderScanThumbnail}
              onSelect={() => onSelectScan(scan)}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

type EntitySortMode = 'sequential' | 'alphabet' | 'amount';
type EntitySortDirection = 'ascending' | 'descending';

function ClassifiedEntityGroup({
  group,
  isExpanded,
  isActive,
  activeSubcategoryId,
  onSelect,
  onToggleExpanded,
}: {
  group: DocumentDetailOverlayTagGroup;
  isExpanded: boolean;
  isActive: boolean;
  activeSubcategoryId?: string;
  onSelect: (targetId: string, firstScan?: number) => void;
  onToggleExpanded: () => void;
}) {
  const hasSubcategories = Boolean(group.subcategories?.length);

  return (
    <article className="document-detail-overlay-tag-group">
      <div className="document-detail-overlay-tag-group-row">
        <button
          type="button"
          className="document-detail-overlay-tag-group-button"
          data-active={isActive ? 'true' : 'false'}
          disabled={group.count <= 0}
          onClick={() => onSelect(`classified:${group.id}`, group.firstScan)}
        >
          <span className="document-detail-overlay-tag-group-icon">
            <TagGroupIcon icon={group.icon} />
          </span>
          <span className="document-detail-overlay-tag-group-label">
            {group.label}
          </span>
          <b>{group.count}</b>
        </button>
        {hasSubcategories ? (
          <button
            type="button"
            aria-label={`Toggle ${group.label} subcategories`}
            aria-expanded={isExpanded}
            className="document-detail-overlay-tag-group-toggle"
            onClick={onToggleExpanded}
          >
            <SidebarDisclosureIcon isExpanded={isExpanded} />
          </button>
        ) : null}
      </div>

      {hasSubcategories && isExpanded ? (
        <div className="document-detail-overlay-tag-subcategories">
          {group.subcategories?.map((subcategory) => (
            <button
              key={subcategory.id}
              type="button"
              className="document-detail-overlay-tag-subcategory"
              data-active={
                activeSubcategoryId === subcategory.id ? 'true' : 'false'
              }
              onClick={() =>
                onSelect(
                  `classified:${group.id}:${subcategory.id}`,
                  subcategory.firstScan,
                )
              }
            >
              <span>{subcategory.label}</span>
              <b>{subcategory.count}</b>
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function IdentifiedEntityButton({
  entity,
  isActive,
  onSelect,
}: {
  entity: DocumentDetailOverlayIdentifiedEntity;
  isActive: boolean;
  onSelect: (targetId: string, firstScan?: number) => void;
}) {
  return (
    <button
      type="button"
      className="document-detail-overlay-tag-identified"
      data-active={isActive ? 'true' : 'false'}
      onClick={() => onSelect(`identified:${entity.id}`, entity.firstScan)}
    >
      <span className="document-detail-overlay-tag-group-icon">
        <TagGroupIcon icon={entity.icon} />
      </span>
      <span className="document-detail-overlay-tag-identified-label">
        {entity.label}
      </span>
      <b>{entity.count}</b>
    </button>
  );
}

function sortIdentifiedEntities(
  entities: DocumentDetailOverlayIdentifiedEntity[],
  sortMode: EntitySortMode,
  direction: EntitySortDirection,
) {
  const sorted = [...entities].sort((first, second) => {
    if (sortMode === 'alphabet') {
      return first.label.localeCompare(second.label, undefined, {
        sensitivity: 'base',
      });
    }

    if (sortMode === 'amount') {
      if (second.count !== first.count) {
        return second.count - first.count;
      }

      return first.label.localeCompare(second.label, undefined, {
        sensitivity: 'base',
      });
    }

    const firstScan = first.firstScan ?? Number.MAX_SAFE_INTEGER;
    const secondScan = second.firstScan ?? Number.MAX_SAFE_INTEGER;

    if (firstScan !== secondScan) {
      return firstScan - secondScan;
    }

    return first.label.localeCompare(second.label, undefined, {
      sensitivity: 'base',
    });
  });

  return direction === 'ascending' ? sorted : sorted.reverse();
}

export function CollapsedMetadataRail({
  content,
  onExpand,
  activeSection,
}: {
  content: DocumentDetailOverlayContent;
  onExpand: (section?: SidebarSectionId) => void;
  activeSection?: SidebarSectionId;
}) {
  return (
    <DocumentDetailIconRail className="document-detail-overlay-collapsed-rail">
      <DocumentDetailRailButton
        aria-label="Open inventory metadata"
        icon={<IconInventory className="document-detail-overlay-icon" />}
        isActive={activeSection === 'inventory'}
        onPress={() => onExpand('inventory')}
      >
        {content.inventory.year}
      </DocumentDetailRailButton>
      <DocumentDetailRailButton
        aria-label="Open table of contents"
        icon={<IconTableOfContent className="document-detail-overlay-icon" />}
        isActive={activeSection === 'contents'}
        onPress={() => onExpand('contents')}
      />
      <DocumentDetailRailButton
        aria-label="Open entity tags"
        icon={<IconEntities className="document-detail-overlay-icon" />}
        isActive={activeSection === 'entities'}
        onPress={() => onExpand('entities')}
      >
        {content.tags.entityCount}
      </DocumentDetailRailButton>
      <DocumentDetailRailButton
        aria-label="Open event tags"
        icon={<IconEvents className="document-detail-overlay-icon" />}
        isActive={activeSection === 'events'}
        onPress={() => onExpand('events')}
      >
        {content.tags.eventCount}
      </DocumentDetailRailButton>
    </DocumentDetailIconRail>
  );
}

export function MetadataSidebar({
  content,
  currentArchiveScan,
  expandedSections,
  renderScanThumbnail,
  onSectionChange,
  onSelectScan,
}: {
  content: DocumentDetailOverlayContent;
  currentArchiveScan: number;
  expandedSections: Record<SidebarSectionId, boolean>;
  renderScanThumbnail: DocumentDetailOverlayScanRenderer;
  onSectionChange: (section: SidebarSectionId, isExpanded: boolean) => void;
  onSelectScan: (scan: DocumentDetailOverlayScan) => void;
}) {
  const [hitsOnly, setHitsOnly] = React.useState(false);
  const classifiedGroups = React.useMemo(
    () =>
      (content.entityGroups ?? []).filter(
        (group) => group.kind === 'Classified',
      ),
    [content.entityGroups],
  );
  const identifiedEntities = React.useMemo(
    () => content.identifiedEntities ?? [],
    [content.identifiedEntities],
  );
  const [entitySortMode, setEntitySortMode] =
    React.useState<EntitySortMode>('sequential');
  const [entitySortDirection, setEntitySortDirection] =
    React.useState<EntitySortDirection>('ascending');
  const [groupByType, setGroupByType] = React.useState(false);
  const [isClassifiedSectionExpanded, setIsClassifiedSectionExpanded] =
    React.useState(false);
  const [isIdentifiedSectionExpanded, setIsIdentifiedSectionExpanded] =
    React.useState(false);
  const wasEntitiesSectionExpandedRef = React.useRef(expandedSections.entities);
  const [activeTagTargetId, setActiveTagTargetId] = React.useState<
    string | null
  >(null);
  const [expandedClassifiedGroupIds, setExpandedClassifiedGroupIds] =
    React.useState<Set<string>>(
      () =>
        new Set(
          classifiedGroups
            .filter((group) => Boolean(group.subcategories?.length))
            .map((group) => group.id),
        ),
    );
  const documents = React.useMemo(() => getDocuments(content), [content]);
  const currentDocument = React.useMemo(
    () => getDocumentByArchiveScan(documents, currentArchiveScan),
    [currentArchiveScan, documents],
  );
  const [expandedDocumentIds, setExpandedDocumentIds] = React.useState<
    Set<string>
  >(() => new Set(currentDocument ? [currentDocument.id] : []));
  const tocPanelRef = React.useRef<HTMLDivElement>(null);
  const tocListRef = React.useRef<HTMLDivElement>(null);
  const entityPanelRef = React.useRef<HTMLDivElement>(null);
  const visibleDocuments = hitsOnly
    ? documents.filter((document) => getDocumentHasResults(document))
    : documents;
  const currentDocumentScan = React.useMemo(
    () =>
      documents
        .flatMap((document) => document.scans)
        .find((scan) => scan.archiveScan === currentArchiveScan)
        ?.documentScan ?? content.currentScan.documentScan,
    [content.currentScan.documentScan, currentArchiveScan, documents],
  );
  const inventoryMetadata =
    content.inventoryMetadata ??
    inventoryFallbackMetadata(content).map(([label, value]) => ({
      label,
      value,
    }));
  const hasInventoryHierarchy = Boolean(content.inventoryHierarchy?.length);
  const inventoryHierarchyTree = React.useMemo(
    () =>
      content.inventoryHierarchy?.length
        ? buildInventoryHierarchyTree(content.inventoryHierarchy)
        : [],
    [content.inventoryHierarchy],
  );
  const sortedIdentifiedEntities = React.useMemo(
    () =>
      sortIdentifiedEntities(
        identifiedEntities,
        entitySortMode,
        entitySortDirection,
      ),
    [entitySortDirection, entitySortMode, identifiedEntities],
  );
  const groupedIdentifiedEntities = React.useMemo(() => {
    if (!groupByType) {
      return [{ type: 'All', entities: sortedIdentifiedEntities }];
    }

    const grouped = new Map<string, DocumentDetailOverlayIdentifiedEntity[]>();

    sortedIdentifiedEntities.forEach((entity) => {
      const bucket = grouped.get(entity.type) ?? [];
      bucket.push(entity);
      grouped.set(entity.type, bucket);
    });

    return Array.from(grouped.entries()).map(([type, entities]) => ({
      type,
      entities,
    }));
  }, [groupByType, sortedIdentifiedEntities]);
  const classifiedTotal =
    content.entityClassifiedTotal ??
    classifiedGroups.reduce((total, group) => total + group.count, 0);
  const identifiedTotal =
    content.entityIdentifiedTotal ??
    identifiedEntities.reduce((total, entity) => total + entity.count, 0);

  React.useEffect(() => {
    if (!currentDocument) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpandedDocumentIds((current) => {
      if (current.has(currentDocument.id)) {
        return current;
      }

      const next = new Set(current);
      next.add(currentDocument.id);
      return next;
    });
  }, [currentDocument]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpandedClassifiedGroupIds((current) => {
      const next = new Set(
        classifiedGroups
          .filter((group) => Boolean(group.subcategories?.length))
          .map((group) => group.id),
      );

      current.forEach((groupId) => {
        if (classifiedGroups.some((group) => group.id === groupId)) {
          next.add(groupId);
        }
      });

      return next;
    });
  }, [classifiedGroups]);

  React.useEffect(() => {
    if (expandedSections.entities && !wasEntitiesSectionExpandedRef.current) {
      setIsClassifiedSectionExpanded(false);
      setIsIdentifiedSectionExpanded(false);
    }

    wasEntitiesSectionExpandedRef.current = expandedSections.entities;
  }, [expandedSections.entities]);

  const toggleDocumentExpanded = (documentId: string) => {
    setExpandedDocumentIds((current) => {
      const next = new Set(current);

      if (next.has(documentId)) {
        next.delete(documentId);
      } else {
        next.add(documentId);
      }

      return next;
    });
  };

  const selectDocumentScan = (documentScan?: number) => {
    if (!documentScan) {
      return;
    }

    const scan =
      content.tableOfContents.find(
        (tocScan) => tocScan.documentScan === documentScan,
      ) ??
      documents
        .flatMap((document) => document.scans)
        .find((tocScan) => tocScan.documentScan === documentScan);

    if (scan) {
      onSelectScan(scan);
    }
  };

  const onSelectTagTarget = (targetId: string, firstScan?: number) => {
    setActiveTagTargetId(targetId);
    selectDocumentScan(firstScan);
  };

  const toggleClassifiedGroupExpanded = (groupId: string) => {
    setExpandedClassifiedGroupIds((current) => {
      const next = new Set(current);

      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }

      return next;
    });
  };

  const onGroupByTypeChange = (isSelected: boolean) => {
    const previousScrollTop = entityPanelRef.current?.scrollTop ?? 0;

    setGroupByType(isSelected);

    window.requestAnimationFrame(() => {
      if (entityPanelRef.current) {
        entityPanelRef.current.scrollTop = previousScrollTop;
      }
    });
  };

  const scrollToCurrentDocument = () => {
    if (hitsOnly) {
      setHitsOnly(false);
    }

    if (currentDocument) {
      setExpandedDocumentIds((current) => {
        if (current.has(currentDocument.id)) {
          return current;
        }

        const next = new Set(current);
        next.add(currentDocument.id);
        return next;
      });
    }

    scrollTocPanelToTarget(
      '.document-detail-overlay-toc-document[data-current-document="true"] .document-detail-overlay-toc-document-button',
    );
  };

  const scrollToCurrentScan = () => {
    if (hitsOnly) {
      setHitsOnly(false);
    }

    if (currentDocument) {
      setExpandedDocumentIds((current) => {
        if (current.has(currentDocument.id)) {
          return current;
        }

        const next = new Set(current);
        next.add(currentDocument.id);
        return next;
      });
    }

    scrollTocPanelToTarget(
      '.document-detail-overlay-toc-card[data-current-scan="true"]',
    );
  };

  const scrollTocPanelToTarget = (selector: string) => {
    const tocList = tocListRef.current;

    if (!tocList) {
      return;
    }

    const tryScroll = (attempt = 0) => {
      const target = tocList.querySelector<HTMLElement>(selector);

      if (!target) {
        if (attempt < 4) {
          window.requestAnimationFrame(() => tryScroll(attempt + 1));
        }

        return;
      }

      target.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        tryScroll();
      });
    });
  };

  return (
    <DocumentDetailMetadataSidebar className="document-detail-overlay-rich-sidebar">
      <DocumentDetailSidebarSection
        className="document-detail-overlay-section-button"
        data-expanded={expandedSections.inventory ? 'true' : 'false'}
        icon={<IconInventory className="document-detail-overlay-icon-medium" />}
        title="Inventory"
        trailing={
          <span className="document-detail-overlay-section-trailing">
            <DocumentDetailMetadataSidebarBadge>
              {content.inventory.year}
            </DocumentDetailMetadataSidebarBadge>
            <SidebarDisclosureIcon isExpanded={expandedSections.inventory} />
          </span>
        }
        isExpanded={expandedSections.inventory}
        onExpandedChange={(isExpanded) =>
          onSectionChange('inventory', isExpanded)
        }
      >
        <div className="document-detail-overlay-metadata">
          <dl>
            {inventoryMetadata.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
            <div>
              <dt>settlement(s)</dt>
              <dd>
                {content.metadata.settlements.map((settlement, index) => (
                  <React.Fragment key={settlement}>
                    {index > 0 && ', '}
                    <EntityTag href="#" type="place">
                      {settlement}
                    </EntityTag>
                  </React.Fragment>
                ))}
              </dd>
            </div>
            <div>
              <dt>handle</dt>
              <dd>
                <a href="#" className="document-detail-overlay-link">
                  {content.metadata.handleLabel}
                  <IconExternalLink className="document-detail-overlay-icon-small" />
                </a>
              </dd>
            </div>
          </dl>
          {!hasInventoryHierarchy ? (
            <p>{content.metadata.archiveDescription}</p>
          ) : null}
          {inventoryHierarchyTree.length ? (
            <InventoryHierarchyTree nodes={inventoryHierarchyTree} />
          ) : null}
        </div>
      </DocumentDetailSidebarSection>

      <DocumentDetailSidebarSection
        className="document-detail-overlay-section-button document-detail-overlay-section-button--contents"
        data-expanded={expandedSections.contents ? 'true' : 'false'}
        icon={
          <IconTableOfContent className="document-detail-overlay-icon-medium" />
        }
        title="Table of Contents"
        trailing={
          <SidebarDisclosureIcon isExpanded={expandedSections.contents} />
        }
        isExpanded={expandedSections.contents}
        onExpandedChange={(isExpanded) =>
          onSectionChange('contents', isExpanded)
        }
      >
        <div className="document-detail-overlay-toc-panel" ref={tocPanelRef}>
          <div className="document-detail-overlay-toc-controls">
            <DocumentDetailCheckbox
              isSelected={hitsOnly}
              onChange={setHitsOnly}
            >
              Hits only
            </DocumentDetailCheckbox>
            <span className="document-detail-overlay-toc-jump-label">
              Go to
            </span>
            <div className="document-detail-overlay-toc-jump-actions">
              <button
                type="button"
                className="document-detail-overlay-toc-jump-button"
                aria-label="Jump to selected document in table of contents"
                onClick={scrollToCurrentDocument}
              >
                <IconEntityDocument className="document-detail-overlay-icon-small" />
                <span>Doc</span>
              </button>
              <button
                type="button"
                className="document-detail-overlay-toc-jump-button"
                aria-label={`Jump to selected scan ${currentDocumentScan} in table of contents`}
                onClick={scrollToCurrentScan}
              >
                <IconScan className="document-detail-overlay-icon-small" />
                <span>Scan {currentDocumentScan}</span>
              </button>
            </div>
          </div>
          <div className="document-detail-overlay-toc-list" ref={tocListRef}>
            {visibleDocuments.map((document) => (
              <DocumentRow
                key={document.id}
                document={document}
                currentArchiveScan={currentArchiveScan}
                hitsOnly={hitsOnly}
                isExpanded={expandedDocumentIds.has(document.id)}
                renderScanThumbnail={renderScanThumbnail}
                onToggleExpanded={() => toggleDocumentExpanded(document.id)}
                onSelectScan={onSelectScan}
              />
            ))}
          </div>
        </div>
      </DocumentDetailSidebarSection>

      <DocumentDetailSidebarSection
        className="document-detail-overlay-section-button"
        data-expanded={expandedSections.entities ? 'true' : 'false'}
        icon={<IconEntities className="document-detail-overlay-icon-medium" />}
        title="Entity tags"
        count={`(${content.tags.entityCount})`}
        trailing={
          <SidebarDisclosureIcon isExpanded={expandedSections.entities} />
        }
        isExpanded={expandedSections.entities}
        onExpandedChange={(isExpanded) =>
          onSectionChange('entities', isExpanded)
        }
      >
        <div className="document-detail-overlay-tag-panel" ref={entityPanelRef}>
          <section className="document-detail-overlay-tag-block">
            <header className="document-detail-overlay-tag-block-header">
              <button
                type="button"
                className="document-detail-overlay-tag-block-toggle"
                data-expanded={isClassifiedSectionExpanded ? 'true' : 'false'}
                aria-expanded={isClassifiedSectionExpanded}
                onClick={() =>
                  setIsClassifiedSectionExpanded((current) => !current)
                }
              >
                <span className="document-detail-overlay-tag-block-title-row">
                  <span className="document-detail-overlay-tag-block-title">
                    Classified as
                  </span>
                  <span>{classifiedTotal}</span>
                </span>
                <SidebarDisclosureIcon
                  isExpanded={isClassifiedSectionExpanded}
                />
              </button>
            </header>
            {isClassifiedSectionExpanded ? (
              <div className="document-detail-overlay-tag-block-content">
                <div className="document-detail-overlay-tag-block-list">
                  {classifiedGroups.map((group) => (
                    <ClassifiedEntityGroup
                      key={group.id}
                      group={group}
                      isExpanded={expandedClassifiedGroupIds.has(group.id)}
                      isActive={activeTagTargetId === `classified:${group.id}`}
                      activeSubcategoryId={
                        activeTagTargetId?.startsWith(`classified:${group.id}:`)
                          ? activeTagTargetId.split(':')[2]
                          : undefined
                      }
                      onSelect={onSelectTagTarget}
                      onToggleExpanded={() =>
                        toggleClassifiedGroupExpanded(group.id)
                      }
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="document-detail-overlay-tag-block document-detail-overlay-tag-block--identified">
            <header className="document-detail-overlay-tag-block-header">
              <button
                type="button"
                className="document-detail-overlay-tag-block-toggle"
                data-expanded={isIdentifiedSectionExpanded ? 'true' : 'false'}
                aria-expanded={isIdentifiedSectionExpanded}
                onClick={() =>
                  setIsIdentifiedSectionExpanded((current) => !current)
                }
              >
                <span className="document-detail-overlay-tag-block-title-row">
                  <span className="document-detail-overlay-tag-block-title">
                    Identified as
                  </span>
                  <span>{identifiedTotal}</span>
                </span>
                <SidebarDisclosureIcon
                  isExpanded={isIdentifiedSectionExpanded}
                />
              </button>
            </header>

            {isIdentifiedSectionExpanded ? (
              <div className="document-detail-overlay-tag-block-content">
                <div className="document-detail-overlay-identified-controls">
                  <div className="document-detail-overlay-identified-sort-row">
                    <DocumentDetailSegmentedToggleGroup
                      className="document-detail-overlay-identified-sort-toggle"
                      size="compact"
                      aria-label="Entity sort controls"
                      selectionMode="single"
                      disallowEmptySelection
                      selectedKeys={new Set([entitySortMode])}
                      onSelectionChange={(keys) => {
                        const [nextSort] = Array.from(keys);

                        if (
                          nextSort === 'sequential' ||
                          nextSort === 'alphabet' ||
                          nextSort === 'amount'
                        ) {
                          setEntitySortMode(nextSort);
                        }
                      }}
                    >
                      <DocumentDetailSegmentedToggleItem
                        id="sequential"
                        size="compact"
                        className="min-w-0 px-s8 text-[10px] leading-3"
                      >
                        Sequential
                      </DocumentDetailSegmentedToggleItem>
                      <DocumentDetailSegmentedToggleItem
                        id="alphabet"
                        size="compact"
                        className="min-w-0 px-s8 text-[10px] leading-3"
                      >
                        Alphabet
                      </DocumentDetailSegmentedToggleItem>
                      <DocumentDetailSegmentedToggleItem
                        id="amount"
                        size="compact"
                        className="min-w-0 px-s8 text-[10px] leading-3"
                      >
                        Amount
                      </DocumentDetailSegmentedToggleItem>
                    </DocumentDetailSegmentedToggleGroup>

                    <div className="document-detail-overlay-identified-options">
                      <DocumentDetailCheckbox
                        isSelected={groupByType}
                        onChange={onGroupByTypeChange}
                      >
                        Type
                      </DocumentDetailCheckbox>
                      <button
                        type="button"
                        className="document-detail-overlay-identified-direction"
                        aria-label={
                          entitySortDirection === 'ascending'
                            ? 'Sort descending'
                            : 'Sort ascending'
                        }
                        onClick={() =>
                          setEntitySortDirection((current) =>
                            current === 'ascending'
                              ? 'descending'
                              : 'ascending',
                          )
                        }
                      >
                        <IconSwap
                          className="document-detail-overlay-icon"
                          data-direction={entitySortDirection}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="document-detail-overlay-tag-block-list document-detail-overlay-tag-block-list--identified">
                  {groupedIdentifiedEntities.map((group) => (
                    <div
                      key={group.type}
                      className="document-detail-overlay-identified-group"
                    >
                      {groupByType ? (
                        <h4 className="document-detail-overlay-identified-group-title">
                          {group.type}
                        </h4>
                      ) : null}
                      {group.entities.map((entity) => (
                        <IdentifiedEntityButton
                          key={entity.id}
                          entity={entity}
                          isActive={
                            activeTagTargetId === `identified:${entity.id}`
                          }
                          onSelect={onSelectTagTarget}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </DocumentDetailSidebarSection>

      <DocumentDetailSidebarSection
        className="document-detail-overlay-section-button"
        data-expanded={expandedSections.events ? 'true' : 'false'}
        icon={<IconEvents className="document-detail-overlay-icon-medium" />}
        title="Event tags"
        count={`(${content.tags.eventCount})`}
        trailing={
          <SidebarDisclosureIcon isExpanded={expandedSections.events} />
        }
        isExpanded={expandedSections.events}
        onExpandedChange={(isExpanded) => onSectionChange('events', isExpanded)}
      >
        <div className="document-detail-overlay-empty-panel">
          No event tags for this scan.
        </div>
      </DocumentDetailSidebarSection>
    </DocumentDetailMetadataSidebar>
  );
}
function inventoryFallbackMetadata(
  content: DocumentDetailOverlayContent,
): [string, string][] {
  return [
    ['Title(s)', content.metadata.titles],
    ['Date', content.metadata.date],
  ];
}
