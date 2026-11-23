import { create } from 'zustand';

import type { ClassifiedHighlightSlice } from './ClassifiedHighlightSlice';
import type { ReadingModeSlice } from './ReadingModeSlice.ts';
import type { ManifestViewerSlice } from './ManifestViewerSlice';
import type { SearchHitSlice } from './SearchHitSlice';
import type { SelectionSlice } from './SelectionSlice';
import type { TocSlice } from './TocSlice';
import type { MetadataSlice } from './ManifestMetadataSlice.ts';

import { cidocEntityClassificationIds, eventCategory } from '../annotation';

export type DocumentState =
  & ClassifiedHighlightSlice
  & ReadingModeSlice
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

const defaultReadingModeSlice: ReadingModeSlice = {
  isInReadingMode: false,
};

const defaultClassifiedHighlightSlice: ClassifiedHighlightSlice = {
  highlightCategories: new Set([...cidocEntityClassificationIds, eventCategory]),
};

const defaultMetadataSlice = {
  metadata: {},
};

const defaultTocSlice = {
  toc: { expandedDocIds: [], navigation: null },
};

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultClassifiedHighlightSlice,
  ...defaultReadingModeSlice,
  ...defaultManifestViewerSlice,
  ...defaultSearchHitSlice,
  ...defaultSelectionSlice,
  ...defaultMetadataSlice,
  ...defaultTocSlice,
}));

export const setState = useDocumentStore.setState;
