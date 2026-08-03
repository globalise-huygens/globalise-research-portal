import { create } from 'zustand';

import type { EntityHighlightSlice } from './EntityHighlightSlice';
import type { LayoutElementsSlice } from './LayoutElementsSlice';
import type { ManifestViewerSlice } from './ManifestViewerSlice';
import type { CanvasIndexesSlice } from './CanvasIndexesSlice';
import type { SearchResultSlice } from './SearchResultsSlice';
import type { SelectionSlice } from './SelectionSlice';
import type { TocSlice } from './TocSlice';
import type { MetadataSlice } from './ManifestMetadataSlice.ts';

import { entityVisualCategories } from '../annotation';

export type DocumentState =
  & EntityHighlightSlice
  & LayoutElementsSlice
  & ManifestViewerSlice
  & CanvasIndexesSlice
  & SearchResultSlice
  & SelectionSlice
  & MetadataSlice
  & TocSlice;

const defaultManifestViewerSlice: ManifestViewerSlice = {
  selectedCanvasId: null,
  selectedCanvasSource: 'external',
  selectedCanvasAt: 0,
  canvases: {},
};

const defaultSelectionSlice: SelectionSlice = {
  hoveredId: null,
  clickedId: null,
};

const defaultSearchResultSlice: SearchResultSlice = {
  searchResults: {
    manifestId: null,
    results: [],
    indexes: { canvasToResults: {}, resultsById: {} },
  },
};

const defaultCanvasIndexesSlice: CanvasIndexesSlice = {
  canvasIndexes: {},
};

const defaultLayoutElementsSlice: LayoutElementsSlice = {
  isLayoutElementsVisible: true,
};

const defaultEntityHighlightSlice: EntityHighlightSlice = {
  entityHighlightCategories: new Set(entityVisualCategories),
};

const defaultMetadataSlice = {
  metadata: {},
};

const defaultTocSlice = {
  toc: { expandedDocIds: [] },
};

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultEntityHighlightSlice,
  ...defaultLayoutElementsSlice,
  ...defaultManifestViewerSlice,
  ...defaultCanvasIndexesSlice,
  ...defaultSearchResultSlice,
  ...defaultSelectionSlice,
  ...defaultMetadataSlice,
  ...defaultTocSlice,
}));

export const setState = useDocumentStore.setState;