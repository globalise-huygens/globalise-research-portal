import type { ReactNode } from 'react';

export type DocumentDetailOverlayScan = {
  archiveScan: number;
  documentScan: number;
  identifier: string;
  documentId?: string;
  documentTitle?: string;
  pages?: number[];
  snippet?: string;
  hasResults?: boolean;
  hitCount?: number;
  selected?: boolean;
};

export type DocumentDetailOverlayScanRenderArgs = {
  scan: DocumentDetailOverlayScan;
  label: string;
  pageCount: 1 | 2;
  className?: string;
};

export type DocumentDetailOverlayScanRenderer = (
  args: DocumentDetailOverlayScanRenderArgs,
) => ReactNode;

export type DocumentDetailOverlayTocMetadata = [label: string, value: string, badge?: string][];

export type DocumentDetailOverlayDocument = {
  id: string;
  title: string;
  hasResults?: boolean;
  scans: DocumentDetailOverlayScan[];
  metadata?: DocumentDetailOverlayTocMetadata;
};

export type DocumentDetailOverlayInventoryMetadataItem = {
  label: string;
  value: string;
};

export type DocumentDetailOverlayInventoryHierarchyItem = {
  level: number;
  label: string;
  isCurrent?: boolean;
};

export type DocumentDetailOverlayTagSubcategory = {
  id: string;
  label: string;
  count: number;
  firstScan?: number;
  scanStride?: number;
};

export type DocumentDetailOverlayTagGroup = {
  id: string;
  label: string;
  count: number;
  kind: 'Classified' | 'Identified';
  icon:
    | 'person'
    | 'organisation'
    | 'ship'
    | 'commodity'
    | 'date'
    | 'place'
    | 'document'
    | 'quantity';
  firstScan?: number;
  scanStride?: number;
  subcategories?: DocumentDetailOverlayTagSubcategory[];
};

export type DocumentDetailOverlayIdentifiedEntity = {
  id: string;
  label: string;
  type: string;
  icon:
    | 'person'
    | 'organisation'
    | 'ship'
    | 'commodity'
    | 'date'
    | 'place'
    | 'document'
    | 'quantity';
  count: number;
  firstScan?: number;
  scanStride?: number;
};

export type DocumentDetailOverlayContent = {
  inventory: {
    title: string;
    year: string;
    description: string;
  };
  metadata: {
    titles: string;
    date: string;
    settlements: string[];
    handleLabel: string;
    archiveDescription: string;
  };
  currentScan: {
    archiveScan: number;
    documentScan: number;
    documentScanTotal: number;
  };
  searchHits: {
    current: number;
    total: number;
  };
  tags: {
    entityCount: number;
    eventCount: number;
  };
  tableOfContents: DocumentDetailOverlayScan[];
  tableOfContentsDocuments?: DocumentDetailOverlayDocument[];
  inventoryMetadata?: DocumentDetailOverlayInventoryMetadataItem[];
  inventoryHierarchy?: DocumentDetailOverlayInventoryHierarchyItem[];
  entityGroups?: DocumentDetailOverlayTagGroup[];
  identifiedEntities?: DocumentDetailOverlayIdentifiedEntity[];
  entityClassifiedTotal?: number;
  entityIdentifiedTotal?: number;
  transcriptLines: string[];
  contentWarning: {
    title: string;
    body: string;
    linkLabel: string;
  };
};

export type DocumentDetailOverlaySidebarSectionId =
  | 'inventory'
  | 'contents'
  | 'entities'
  | 'events';

export type DocumentDetailOverlayPaneKey = 'scan' | 'text';
