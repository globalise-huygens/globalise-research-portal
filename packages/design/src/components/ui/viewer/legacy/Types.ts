import type { ReactNode } from 'react';

export type ManifestViewerScan = {
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

export type ManifestViewerScanRenderArgs = {
  scan: ManifestViewerScan;
  label: string;
  pageCount: 1 | 2;
  className?: string;
};

export type ManifestViewerScanRenderer = (
  args: ManifestViewerScanRenderArgs,
) => ReactNode;

export type ManifestViewerTocMetadata = [label: string, value: string, badge?: string][];

export type ManifestViewerDocument = {
  id: string;
  title: string;
  hasResults?: boolean;
  scans: ManifestViewerScan[];
  metadata?: ManifestViewerTocMetadata;
};

export type ManifestViewerInventoryMetadataItem = {
  label: string;
  value: string;
};

export type ManifestViewerInventoryHierarchyItem = {
  level: number;
  label: string;
  isCurrent?: boolean;
};

export type ManifestViewerTagSubcategory = {
  id: string;
  label: string;
  count: number;
  firstScan?: number;
  scanStride?: number;
};

export type ManifestViewerTagGroup = {
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
  subcategories?: ManifestViewerTagSubcategory[];
};

export type ManifestViewerIdentifiedEntity = {
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

export type ManifestViewerContent = {
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
  tableOfContents: ManifestViewerScan[];
  tableOfContentsDocuments?: ManifestViewerDocument[];
  inventoryMetadata?: ManifestViewerInventoryMetadataItem[];
  inventoryHierarchy?: ManifestViewerInventoryHierarchyItem[];
  entityGroups?: ManifestViewerTagGroup[];
  identifiedEntities?: ManifestViewerIdentifiedEntity[];
  entityClassifiedTotal?: number;
  entityIdentifiedTotal?: number;
  transcriptLines: string[];
  contentWarning: {
    title: string;
    body: string;
    linkLabel: string;
  };
};

export type ManifestViewerSidebarSectionId =
  | 'inventory'
  | 'contents'
  | 'entities'
  | 'events';

export type ManifestViewerPaneKey = 'scan' | 'text';
