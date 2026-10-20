import { create } from 'zustand';

import type { EntityHighlightSlice } from './EntityHighlightSlice';
import type { LayoutElementsSlice } from './LayoutElementsSlice';
import type { ManifestViewerSlice } from './ManifestViewerSlice';
import type { SearchHitSlice } from './SearchHitSlice';
import type { SelectionSlice } from './SelectionSlice';
import type { TocSlice } from './TocSlice';
import type { MetadataSlice } from './ManifestMetadataSlice.ts';

import { cidocEntityClassificationIds } from '../annotation';

export type DocumentState =
  & EntityHighlightSlice
  & LayoutElementsSlice
  & ManifestViewerSlice
  & SearchHitSlice
  & SelectionSlice
  & MetadataSlice
  & TocSlice;

const defaultManifestViewerSlice: ManifestViewerSlice = {
  selectedCanvasId: null,
  selectedCanvasSource: 'external',
  selectedCanvasAt: 0,
  canvases: {},
};

const defaultSearchHitSlice: SearchHitSlice = {
  searchHits: {},
  activeEsHitIndex: null,
};

const defaultSelectionSlice: SelectionSlice = {
  hovered: null,
  clicked: null,
};

const defaultLayoutElementsSlice: LayoutElementsSlice = {
  isLayoutElementsVisible: true,
};

const defaultEntityHighlightSlice: EntityHighlightSlice = {
  entityHighlightCategories: new Set(cidocEntityClassificationIds),
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
  ...defaultSearchHitSlice,
  ...defaultSelectionSlice,
  ...defaultMetadataSlice,
  ...defaultTocSlice,
}));

export const setState = useDocumentStore.setState;
