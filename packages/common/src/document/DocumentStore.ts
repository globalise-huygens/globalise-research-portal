import { create } from 'zustand';

import type { EntityHighlightSlice } from './EntityHighlightSlice';
import type { LayoutElementsSlice } from './LayoutElementsSlice';
import type { ManifestViewerSlice } from './ManifestViewerSlice';
import type { SelectionSlice } from './SelectionSlice';
import type { TocSlice } from './TocSlice';
import type { MetadataSlice } from './ManifestMetadataSlice.ts';

import { entityClassificationIds } from '../annotation';

export type DocumentState =
  & EntityHighlightSlice
  & LayoutElementsSlice
  & ManifestViewerSlice
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
  hoveredAt: null,
  clickedId: null,
};

const defaultLayoutElementsSlice: LayoutElementsSlice = {
  isLayoutElementsVisible: true,
};

const defaultEntityHighlightSlice: EntityHighlightSlice = {
  entityHighlightCategories: new Set(entityClassificationIds),
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
  ...defaultSelectionSlice,
  ...defaultMetadataSlice,
  ...defaultTocSlice,
}));

export const setState = useDocumentStore.setState;
