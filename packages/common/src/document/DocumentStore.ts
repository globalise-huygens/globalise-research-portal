import { create } from 'zustand';

import type { ClassifiedHighlightSlice } from './ClassifiedHighlightSlice';
import type { LayoutElementsSlice } from './LayoutElementsSlice';
import type { ManifestViewerSlice } from './ManifestViewerSlice';
import type { SelectionSlice } from './SelectionSlice';
import type { TocSlice } from './TocSlice';
import type { MetadataSlice } from './ManifestMetadataSlice.ts';

import { cidocEntityClassificationIds, eventCategory } from '../annotation';

export type DocumentState =
  & ClassifiedHighlightSlice
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
  hovered: null,
  clicked: null,
};

const defaultLayoutElementsSlice: LayoutElementsSlice = {
  isLayoutElementsVisible: true,
};

const defaultClassifiedHighlightSlice: ClassifiedHighlightSlice = {
  highlightCategories: new Set([...cidocEntityClassificationIds, eventCategory]),
};

const defaultMetadataSlice = {
  metadata: {},
};

const defaultTocSlice = {
  toc: { expandedDocIds: [] },
};

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultClassifiedHighlightSlice,
  ...defaultLayoutElementsSlice,
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
  ...defaultMetadataSlice,
  ...defaultTocSlice,
}));

export const setState = useDocumentStore.setState;
